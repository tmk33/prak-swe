const moment = require('moment');

module.exports = (pool) => {
    const getCurrentDateTime = async () => { 
        try {
            const result = await pool.query('SELECT NOW()'); 
            return result.rows[0].now; 
        } catch (err) {
            console.error('Database query error:', err);
            return new Date(); 
        }
    };

    const generateVeranstaltung = async (req, res) => { 
        const { name, fachbereichId } = req.body;

        async function findWochentagWithFewestKurs(client, fachbereichId) {
            const result = await client.query(`
              SELECT mon, tue, wed, thu, fri
              FROM Wochentagfachbereich
              WHERE fachbereich_id = $1
            `, [fachbereichId]);
          
            const { mon, tue, wed, thu, fri } = result.rows[0];
            const days = [
              { name: 'mon', value: mon },
              { name: 'tue', value: tue },
              { name: 'wed', value: wed },
              { name: 'thu', value: thu },
              { name: 'fri', value: fri }
            ];
          
            // // Sort days by ascending number of Kursanzahl
            days.sort((a, b) => a.value - b.value);
          
            return days; // Return the entire sorted array
          }
          
        async function findAllAvailableTimeBlocks(client, fachbereichId, tag) {
            const result = await client.query(`
              SELECT startTime, endTime
              FROM Kurs
              WHERE fachbereich_id = $1 AND wochentag = $2
            `, [fachbereichId, tag]);
          
            const existingTimeBlocks = result.rows;
            const blocks = [];
          
            // Initialize the blocks array with time blocks from 8h to 18h
            for (let i = 8; i < 18; i += 2) {
              blocks.push({ startTime: `${i}:00`, endTime: `${i + 2}:00`, available: true });
            }
          
            // Mark used blocks
            for (const timeBlock of existingTimeBlocks) {
              const startBlockIndex = Math.floor(moment(timeBlock.starttime, 'HH:mm').hour() / 2) - 4; // Chuyển đổi giờ bắt đầu thành chỉ số block
              const endBlockIndex = Math.floor(moment(timeBlock.endtime, 'HH:mm').hour() / 2) - 4; // Chuyển đổi giờ kết thúc thành chỉ số block
          
              for (let i = startBlockIndex; i < endBlockIndex; i++) {
                blocks[i].available = false; // Mark block as unavailable
              }
            }
          
            // Filter out available empty blocks
            const availableTimeBlocks = blocks.filter(block => block.available);
          
            return availableTimeBlocks;
        }
          
        async function findSuitableDozentAndExactTimeBlock(client, availableTimeBlocks, tag) {
            let suitableDozent = null;
            let minKursanzahl = 0;
            let maxKursanzahl = await client.query(`
                SELECT MAX(kursanzahl)
                FROM Mitarbeiter
                WHERE rolle = 'Dozent'
            `);
        
            maxKursanzahl = maxKursanzahl.rows[0].max; // Get the maxKursanzahl value
            let timeBlockIndex = 0; // Initialize the time block index
            let timeBlock = availableTimeBlocks[timeBlockIndex]; // Get the first time block
            while (!suitableDozent && minKursanzahl <= maxKursanzahl + 1 && timeBlockIndex < availableTimeBlocks.length) { 
                
                timeBlock = availableTimeBlocks[timeBlockIndex];
                
                const result = await client.query(`
                    SELECT id, kursanzahl
                    FROM Mitarbeiter
                    WHERE rolle = 'Dozent' AND kursanzahl = $1
                `, [minKursanzahl]);
        
                for (const dozent of result.rows) {
                    const dozentId = dozent.id;
                    const conflict = await client.query(`
                        SELECT 1
                        FROM Kurs
                        WHERE mitarbeiter_id = $1 AND wochentag = $4
                            AND (
                                (startTime <= $2 AND endTime > $2) OR
                                (startTime < $3 AND endTime >= $3) OR
                                (startTime >= $2 AND endTime <= $3)
                            )
                    `, [dozentId, timeBlock.startTime, timeBlock.endTime, tag]); // Use the current timeBlock
        
                    if (!conflict.rows.length) {
                        suitableDozent = dozent;
                        break;
                    }
                }
        
                if (!suitableDozent) {
                    if (minKursanzahl >= maxKursanzahl + 1) {
                        // If searched all Dozent with kursanzahl less than maxKursanzahl + 1 and cannot find one
                        // then move to the next time block
                        minKursanzahl = 0; // Reset minKursanzahl for the new time block
                        timeBlockIndex++; // Move to the next time block
                    } else {
                        minKursanzahl++;
                    }
                }
            }
        
            
            return suitableDozent ? { dozentId: suitableDozent.id, timeBlock, tag } : null;
        }
        
        async function findAvailableRaum(client, availableTimeBlocks, tag) {
            const result = await client.query(`
              SELECT id
              FROM Raum
              WHERE id NOT IN (
                SELECT raum_id
                FROM Kurs
                WHERE (
                  ((startTime <= $1 AND endTime > $1) OR 
                  (startTime < $2 AND endTime >= $2) OR
                  (startTime >= $1 AND endTime <= $2)) AND wochentag = $3
                )
              )
              LIMIT 1
            `, [availableTimeBlocks.startTime, availableTimeBlocks.endTime, tag]);
          
            return result.rows[0]?.id;
        }
          
        async function saveNewKursToDatabase(client, name, tag, timeBlock, dozentId, raumId, fachbereichId) {
            try {
              await client.query('BEGIN'); 
          
              const result = await client.query(`
                INSERT INTO Kurs (name, wochentag, startTime, endTime, mitarbeiter_id, raum_id, fachbereich_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
              `, [name, tag, timeBlock.startTime, timeBlock.endTime, dozentId, raumId, fachbereichId]);
          
              const newKursId = result.rows[0].id;
          
              // Updated Dozent's kursanzahl
              await client.query(`
                UPDATE Mitarbeiter
                SET kursanzahl = kursanzahl + 1
                WHERE id = $1
              `, [dozentId]);
          
              // Update the number of kursanzahl in Wochentagfachbereich table
              await client.query(`
                UPDATE wochentagfachbereich
                SET ${tag} = ${tag} + 1
                WHERE fachbereich_id = $1
              `, [fachbereichId]);
          
              await client.query('COMMIT'); 
          
              return newKursId;
            } catch (error) {
              await client.query('ROLLBACK'); 
              throw error; 
            }
          }
          
          

        try {
            const client = await pool.connect();
            const tag = await findWochentagWithFewestKurs(client, fachbereichId);
            let availableTimeBlocks  = [];
            let chosenDay = null;
            let suitableDozentAndExactTimeBlock = null;
            let availableRaum = null;
            let tagIndex = 0; // Initialize the tag index
            
            while (!suitableDozentAndExactTimeBlock && tagIndex < tag.length) {
                // Browse the days in ascending order of Kursanzahl
                chosenDay = tag[tagIndex].name;
                availableTimeBlocks  = await findAllAvailableTimeBlocks(client, fachbereichId, chosenDay);

                if (availableTimeBlocks .length > 0) {
                    // Find the exact suitable Dozent, timeBlock and Raum for the current day
                    suitableDozentAndExactTimeBlock = await findSuitableDozentAndExactTimeBlock(client, availableTimeBlocks , chosenDay);
                    if (suitableDozentAndExactTimeBlock) {
                        availableRaum = await findAvailableRaum(client, suitableDozentAndExactTimeBlock.timeBlock, suitableDozentAndExactTimeBlock.tag);
                        break; // Exit the loop when a exact suitable Dozent, timeBlock and Raum are found
                    }
                }
                tagIndex++;
            }
                // save new Kurs to database
            const newKursId = await saveNewKursToDatabase(client, name, chosenDay, suitableDozentAndExactTimeBlock.timeBlock, suitableDozentAndExactTimeBlock.dozentId, availableRaum, fachbereichId);

            await client.release();

            res.json({ message: 'Kurs created successfully!', Result: suitableDozentAndExactTimeBlock, raum: availableRaum, kurID: newKursId});
                    
        } catch (err) {
            console.error('Error:', err);
            return new Date();
        }
    };

    return {
        getCurrentDateTime,
        generateVeranstaltung
    };
};