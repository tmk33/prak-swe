--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: fachbereich; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fachbereich (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.fachbereich OWNER TO postgres;

--
-- Name: fachbereich_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fachbereich_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fachbereich_id_seq OWNER TO postgres;

--
-- Name: fachbereich_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fachbereich_id_seq OWNED BY public.fachbereich.id;


--
-- Name: kurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kurs (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    wochentag character varying(10),
    starttime time without time zone,
    endtime time without time zone,
    mitarbeiter_id integer,
    raum_id integer,
    fachbereich_id integer,
    CONSTRAINT kurs_wochentag_check CHECK (((wochentag)::text = ANY ((ARRAY['mon'::character varying, 'tue'::character varying, 'wed'::character varying, 'thu'::character varying, 'fri'::character varying])::text[])))
);


ALTER TABLE public.kurs OWNER TO postgres;

--
-- Name: kurs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kurs_id_seq OWNER TO postgres;

--
-- Name: kurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kurs_id_seq OWNED BY public.kurs.id;


--
-- Name: mitarbeiter; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mitarbeiter (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    geburtsdatum date,
    rolle character varying(20),
    kursanzahl integer DEFAULT 0,
    sonderkursanzahl integer DEFAULT 0,
    password_hash text,
    CONSTRAINT mitarbeiter_rolle_check CHECK (((rolle)::text = ANY ((ARRAY['Admin'::character varying, 'Dozent'::character varying, 'Marketing'::character varying])::text[])))
);


ALTER TABLE public.mitarbeiter OWNER TO postgres;

--
-- Name: mitarbeiter_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mitarbeiter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mitarbeiter_id_seq OWNER TO postgres;

--
-- Name: mitarbeiter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mitarbeiter_id_seq OWNED BY public.mitarbeiter.id;


--
-- Name: raum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raum (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    ort character varying(20),
    CONSTRAINT raum_ort_check CHECK (((ort)::text = ANY ((ARRAY['Campus A'::character varying, 'Campus B'::character varying])::text[])))
);


ALTER TABLE public.raum OWNER TO postgres;

--
-- Name: raum_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.raum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raum_id_seq OWNER TO postgres;

--
-- Name: raum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.raum_id_seq OWNED BY public.raum.id;


--
-- Name: sonderveranstaltung; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sonderveranstaltung (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    starttime timestamp without time zone,
    endtime timestamp without time zone,
    beschreibung text,
    mitarbeiter_id integer,
    raum_id integer
);


ALTER TABLE public.sonderveranstaltung OWNER TO postgres;

--
-- Name: sonderveranstaltung_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sonderveranstaltung_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sonderveranstaltung_id_seq OWNER TO postgres;

--
-- Name: sonderveranstaltung_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sonderveranstaltung_id_seq OWNED BY public.sonderveranstaltung.id;


--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    geburtsdatum date,
    fachbereich_id integer
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_id_seq OWNER TO postgres;

--
-- Name: student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_id_seq OWNED BY public.student.id;


--
-- Name: student_sonderveranstaltung; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_sonderveranstaltung (
    student_id integer NOT NULL,
    sonderveranstaltung_id integer NOT NULL
);


ALTER TABLE public.student_sonderveranstaltung OWNER TO postgres;

--
-- Name: wochentagfachbereich; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wochentagfachbereich (
    id integer NOT NULL,
    fachbereich_id integer,
    mon integer,
    tue integer,
    wed integer,
    thu integer,
    fri integer
);


ALTER TABLE public.wochentagfachbereich OWNER TO postgres;

--
-- Name: wochentagfachbereich_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wochentagfachbereich_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wochentagfachbereich_id_seq OWNER TO postgres;

--
-- Name: wochentagfachbereich_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wochentagfachbereich_id_seq OWNED BY public.wochentagfachbereich.id;


--
-- Name: fachbereich id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fachbereich ALTER COLUMN id SET DEFAULT nextval('public.fachbereich_id_seq'::regclass);


--
-- Name: kurs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kurs ALTER COLUMN id SET DEFAULT nextval('public.kurs_id_seq'::regclass);


--
-- Name: mitarbeiter id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitarbeiter ALTER COLUMN id SET DEFAULT nextval('public.mitarbeiter_id_seq'::regclass);


--
-- Name: raum id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raum ALTER COLUMN id SET DEFAULT nextval('public.raum_id_seq'::regclass);


--
-- Name: sonderveranstaltung id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sonderveranstaltung ALTER COLUMN id SET DEFAULT nextval('public.sonderveranstaltung_id_seq'::regclass);


--
-- Name: student id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student ALTER COLUMN id SET DEFAULT nextval('public.student_id_seq'::regclass);


--
-- Name: wochentagfachbereich id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wochentagfachbereich ALTER COLUMN id SET DEFAULT nextval('public.wochentagfachbereich_id_seq'::regclass);


--
-- Data for Name: fachbereich; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fachbereich (id, name) FROM stdin;
1	Informatik
2	Elektronik
3	Design
\.


--
-- Data for Name: kurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kurs (id, name, wochentag, starttime, endtime, mitarbeiter_id, raum_id, fachbereich_id) FROM stdin;
1	Software Engineering	mon	08:00:00	10:00:00	3	1	1
2	Datenanalyse	tue	08:00:00	10:00:00	4	1	1
3	Datennetze	wed	08:00:00	10:00:00	3	1	1
4	Data Science	thu	08:00:00	10:00:00	4	1	1
5	Cloud Computing	fri	08:00:00	10:00:00	3	1	1
6	Web Engineering	mon	10:00:00	12:00:00	4	1	1
\.


--
-- Data for Name: mitarbeiter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mitarbeiter (id, name, email, geburtsdatum, rolle, kursanzahl, sonderkursanzahl, password_hash) FROM stdin;
1	Max Mustermann	admin@beispiel.de	1988-05-12	Admin	0	0	$2b$10$dzrG8v090ww3CnRxV5nT7e.RCDk1WeUP.Vwuu9btWMZYP59sUykXq
2	Anna Schmidt	anna.schmidt@beispiel.de	1992-09-28	Marketing	0	0	
4	Peter Mueller	peter.mueller@beispiel.de	1975-02-03	Dozent	3	0	
3	Thanh Khong	thanh.khong@beispiel.de	1997-09-28	Dozent	3	1	
\.


--
-- Data for Name: raum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raum (id, name, ort) FROM stdin;
1	A102	Campus A
2	A101	Campus A
3	A103	Campus A
4	A104	Campus A
5	A201	Campus A
6	A202	Campus A
7	A203	Campus A
8	A204	Campus A
9	B101	Campus B
10	B102	Campus B
11	B103	Campus B
12	B104	Campus B
\.


--
-- Data for Name: sonderveranstaltung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sonderveranstaltung (id, name, starttime, endtime, beschreibung, mitarbeiter_id, raum_id) FROM stdin;
1	Workshop Python	2024-07-30 08:00:00	2024-07-30 12:00:00	Einfuehrung in die Programmiersprache Python	3	2
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, name, email, geburtsdatum, fachbereich_id) FROM stdin;
1	Lian Tritten	lian.tritten@example.com	2000-09-24	1
\.


--
-- Data for Name: student_sonderveranstaltung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_sonderveranstaltung (student_id, sonderveranstaltung_id) FROM stdin;
1	1
\.


--
-- Data for Name: wochentagfachbereich; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wochentagfachbereich (id, fachbereich_id, mon, tue, wed, thu, fri) FROM stdin;
2	2	0	0	0	0	0
3	3	0	0	0	0	0
1	1	2	1	1	1	1
\.


--
-- Name: fachbereich_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fachbereich_id_seq', 3, true);


--
-- Name: kurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kurs_id_seq', 6, true);


--
-- Name: mitarbeiter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mitarbeiter_id_seq', 4, true);


--
-- Name: raum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raum_id_seq', 12, true);


--
-- Name: sonderveranstaltung_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sonderveranstaltung_id_seq', 1, true);


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_id_seq', 1, true);


--
-- Name: wochentagfachbereich_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wochentagfachbereich_id_seq', 3, true);


--
-- Name: fachbereich fachbereich_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fachbereich
    ADD CONSTRAINT fachbereich_pkey PRIMARY KEY (id);


--
-- Name: kurs kurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kurs
    ADD CONSTRAINT kurs_pkey PRIMARY KEY (id);


--
-- Name: mitarbeiter mitarbeiter_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitarbeiter
    ADD CONSTRAINT mitarbeiter_email_key UNIQUE (email);


--
-- Name: mitarbeiter mitarbeiter_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mitarbeiter
    ADD CONSTRAINT mitarbeiter_pkey PRIMARY KEY (id);


--
-- Name: raum raum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raum
    ADD CONSTRAINT raum_pkey PRIMARY KEY (id);


--
-- Name: sonderveranstaltung sonderveranstaltung_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sonderveranstaltung
    ADD CONSTRAINT sonderveranstaltung_pkey PRIMARY KEY (id);


--
-- Name: student student_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_email_key UNIQUE (email);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- Name: student_sonderveranstaltung student_sonderveranstaltung_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_sonderveranstaltung
    ADD CONSTRAINT student_sonderveranstaltung_pkey PRIMARY KEY (student_id, sonderveranstaltung_id);


--
-- Name: wochentagfachbereich wochentagfachbereich_fachbereich_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wochentagfachbereich
    ADD CONSTRAINT wochentagfachbereich_fachbereich_id_key UNIQUE (fachbereich_id);


--
-- Name: wochentagfachbereich wochentagfachbereich_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wochentagfachbereich
    ADD CONSTRAINT wochentagfachbereich_pkey PRIMARY KEY (id);


--
-- Name: kurs kurs_fachbereich_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kurs
    ADD CONSTRAINT kurs_fachbereich_id_fkey FOREIGN KEY (fachbereich_id) REFERENCES public.fachbereich(id);


--
-- Name: kurs kurs_mitarbeiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kurs
    ADD CONSTRAINT kurs_mitarbeiter_id_fkey FOREIGN KEY (mitarbeiter_id) REFERENCES public.mitarbeiter(id);


--
-- Name: kurs kurs_raum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kurs
    ADD CONSTRAINT kurs_raum_id_fkey FOREIGN KEY (raum_id) REFERENCES public.raum(id);


--
-- Name: sonderveranstaltung sonderveranstaltung_mitarbeiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sonderveranstaltung
    ADD CONSTRAINT sonderveranstaltung_mitarbeiter_id_fkey FOREIGN KEY (mitarbeiter_id) REFERENCES public.mitarbeiter(id);


--
-- Name: sonderveranstaltung sonderveranstaltung_raum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sonderveranstaltung
    ADD CONSTRAINT sonderveranstaltung_raum_id_fkey FOREIGN KEY (raum_id) REFERENCES public.raum(id);


--
-- Name: student student_fachbereich_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_fachbereich_id_fkey FOREIGN KEY (fachbereich_id) REFERENCES public.fachbereich(id);


--
-- Name: student_sonderveranstaltung student_sonderveranstaltung_sonderveranstaltung_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_sonderveranstaltung
    ADD CONSTRAINT student_sonderveranstaltung_sonderveranstaltung_id_fkey FOREIGN KEY (sonderveranstaltung_id) REFERENCES public.sonderveranstaltung(id);


--
-- Name: student_sonderveranstaltung student_sonderveranstaltung_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_sonderveranstaltung
    ADD CONSTRAINT student_sonderveranstaltung_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- Name: wochentagfachbereich wochentagfachbereich_fachbereich_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wochentagfachbereich
    ADD CONSTRAINT wochentagfachbereich_fachbereich_id_fkey FOREIGN KEY (fachbereich_id) REFERENCES public.fachbereich(id);


--
-- PostgreSQL database dump complete
--

