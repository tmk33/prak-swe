const moment = require('moment');

module.exports = (pool) => {

    const krankMeldung = async (req, res) => { 
        const { mitarbeiterId, wochentag, date } = req.body;

            // Function to find a substitute Dozent
        async function findSubstituteDozent(client, kurs, wochentag) {
            const timeBlock = { startTime: kurs.starttime, endTime: kurs.endtime };
            const substituteDozentId = await findSuitableDozent(client, timeBlock, wochentag, kurs.fachbereich_id);
            return substituteDozentId;
        }

        // Function to cancel a Kurs and notify students
        async function cancelKursAndNotifyStudents(client, fachbereichId, kursId) {
            // Get the list of students registered for this Kurs
            const { rows: studentRows  } = await client.query(
                'SELECT id, name, email FROM student WHERE fachbereich_id = $1',
                [fachbereichId]
            );
            const notificationResults = [];

            // Send notifications to each student
            for (const student of studentRows ) {
                // send per Email...
                console.log("Notify student " + student.email + " that Kurs " + kursId + " on date " + date + " is canceled!");
                const message = `Notify student ${student.email} that Kurs ${kursId} on date ${date} is canceled!`;
                notificationResults.push({
                    studentId: student.id,
                    email: student.email,
                    notification: message,
                });
            }
            return notificationResults;
        }

        async function findSuitableDozent(client, timeBlock, wochentag) {
            let suitableDozent = null;
            let minKursanzahl = 0;
          
            // Get the maximum Kursanzahl for all Dozent
            const maxKursanzahlResult = await client.query(`
              SELECT MAX(kursanzahl) 
              FROM Mitarbeiter 
              WHERE rolle = 'Dozent'
            `);
          
            const maxKursanzahl = maxKursanzahlResult.rows[0].max || 0; // If there are no Dozent, maxKursanzahl = 0


            while (!suitableDozent && minKursanzahl <= maxKursanzahl) {
              const dozentResult = await client.query(`
                SELECT id, kursanzahl, email
                FROM Mitarbeiter
                WHERE rolle = 'Dozent' AND kursanzahl = $1
              `, [minKursanzahl]);
          
              for (const dozent of dozentResult.rows) {
                const dozentId = dozent.id;
                const conflictResult = await client.query(`
                  SELECT 1
                  FROM Kurs
                  WHERE mitarbeiter_id = $1 AND wochentag = $2
                    AND (
                      (startTime <= $3 AND endTime > $3) OR
                      (startTime < $4 AND endTime >= $4) OR
                      (startTime >= $3 AND endTime <= $4)
                    )
                `, [dozent.id, wochentag, timeBlock.startTime, timeBlock.endTime]);
          
                if (!conflictResult.rows.length) {
                  suitableDozent = dozent;
                  break;
                }
              }
          
              minKursanzahl++; // Increase minKursanzahl to find Dozent with more kursanzahl
            }
            

            return suitableDozent ? { dozentId: suitableDozent.id, khungGio: timeBlock, wochentag, email: suitableDozent.email} : null;
        }
          
          
          

        try {
            const client = await pool.connect();
            await client.query('BEGIN'); 

            const processingResults = [];
            const messageToStudent = [];
            const messageToDozent = [];
            // check Dozent's kursanzahl
            const { rows: mitarbeiterRows } = await client.query(
            'SELECT kursanzahl FROM Mitarbeiter WHERE id = $1',
            [mitarbeiterId]
            );
            if (mitarbeiterRows.length === 0 || mitarbeiterRows[0].kursanzahl === 0) {
                await client.query('COMMIT'); // this Dozent does not have any Kurs
                return res.json({ message: 'This Dozent does not have any Kurs.' });
            }

            // Find the Dozent's Kurs on the given day
            const { rows: kurseRows } = await client.query(
            'SELECT * FROM Kurs WHERE mitarbeiter_id = $1 AND wochentag = $2',
            [mitarbeiterId, wochentag]
            );

            
            // Find substitute Dozent and process Kurs
            for (const kurs of kurseRows) {
                const substituteDozent = await findSubstituteDozent(client, kurs, wochentag);

                if (substituteDozent) {
                    // Update Kurs with the substitute  Dozent
                    // Notify the new Dozent
                    processingResults.push({ date: date, kursId: kurs.id, status: 'dozentReplaced', newDozent: substituteDozent.dozentId });
                    console.log("Notify Dozent: " + substituteDozent.email + "  to teach Kurs " + kurs.id + " on date " + date);
                    const message = `Notify Dozent: ${substituteDozent.email} to teach Kurs ${kurs.id} on date ${date}`;
                    messageToDozent.push({
                        dozentId: substituteDozent.dozentId,
                        email: substituteDozent.email,
                        notification: message,
                    });
                } else {
                    // No substitute found, cancel the Kurs and notify students
                    result = await cancelKursAndNotifyStudents(client, kurs.fachbereich_id, kurs.id);
                    messageToStudent.push(result);
                    processingResults.push({ date: date, kursId: kurs.id, status: 'kursCanceled' }); 

                }
            }

            await client.query('COMMIT');
            res.json({ message: 'processed successfully!', result: processingResults , messageToStudent: messageToStudent, messageToDozent: messageToDozent}); 

        } catch (err) {
            console.error('Error:', err);
            return new Date(); 
        }
    };

    return {
        
        krankMeldung
    };
};