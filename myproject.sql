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
    beschreibung text
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
2	Design
3	Maschinenbau
\.


--
-- Data for Name: kurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kurs (id, name, wochentag, starttime, endtime, mitarbeiter_id, raum_id, fachbereich_id) FROM stdin;
1	Software Engineering	mon	08:00:00	10:00:00	1	1	1
3	Theoretische Informatik	mon	10:00:00	12:00:00	1	3	1
2	Robotik	mon	10:00:00	12:00:00	2	2	3
\.


--
-- Data for Name: mitarbeiter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mitarbeiter (id, name, email, geburtsdatum, rolle) FROM stdin;
1	Babette Mein	babette.mein@example.com	1980-05-15	Dozent
2	Louise Kunz	louise.kunz@example.com	1985-08-22	Dozent
3	Johann Mandel	johann.mandel@example.com	1990-03-10	Marketing
4	Waldemar Rose	waldemar.rose@example.com	1975-12-03	Admin
\.


--
-- Data for Name: raum; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raum (id, name, ort) FROM stdin;
1	A101	Campus A
2	B205	Campus B
3	A303	Campus A
\.


--
-- Data for Name: sonderveranstaltung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sonderveranstaltung (id, name, starttime, endtime, beschreibung) FROM stdin;
1	Workshop Python	2024-08-10 14:00:00	2024-08-10 17:00:00	Einfuehrung in die Programmiersprache Python
2	Workshop Design	2024-09-22 09:00:00	2024-09-22 12:00:00	Design
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student (id, name, email, geburtsdatum, fachbereich_id) FROM stdin;
1	Lian Tritten	test1@example.com	2000-09-25	1
2	Ulla Shriver	test2@example.com	2001-06-12	2
3	Anne Bedrosian	test4@example.com	2002-03-20	3
4	Lisbeth Gaertner	test3@example.com	1999-11-08	1
\.


--
-- Data for Name: student_sonderveranstaltung; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_sonderveranstaltung (student_id, sonderveranstaltung_id) FROM stdin;
1	1
3	1
2	2
\.


--
-- Data for Name: wochentagfachbereich; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wochentagfachbereich (id, fachbereich_id, mon, tue, wed, thu, fri) FROM stdin;
1	1	1	1	0	0	0
2	2	2	2	2	1	1
3	3	3	2	2	2	2
\.


--
-- Name: fachbereich_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fachbereich_id_seq', 3, true);


--
-- Name: kurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kurs_id_seq', 3, true);


--
-- Name: mitarbeiter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mitarbeiter_id_seq', 4, true);


--
-- Name: raum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raum_id_seq', 3, true);


--
-- Name: sonderveranstaltung_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sonderveranstaltung_id_seq', 2, true);


--
-- Name: student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_id_seq', 4, true);


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

