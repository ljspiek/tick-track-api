BEGIN;

TRUNCATE
    ticktrack_users,
    ticktrack_infectionindicatorslog,
    ticktrack_symptomsdetail
RESTART IDENTITY CASCADE;

INSERT INTO ticktrack_users (email, password)
VALUES
    ('test@testing.com', 'password1'),
    ('user@user.com', 'password2'),
    ('lastone@thatsit.com', 'password3');

INSERT INTO ticktrack_logs (user_id, date_created, general_health_id)
VALUES
    (1, now(), 3),
    (1, now()-'1 days'::INTERVAL, 3),
    (1, now()-'2 days'::INTERVAL, 4),
    (2, now(), 2),
    (2, now()-'1 days'::INTERVAL, 3),
    (2, now()-'2 days'::INTERVAL, 2),
    (3, now(), 3),
    (3, now()-'3 days'::INTERVAL, 3),
    (3, now()-'2 days'::INTERVAL, 4);

INSERT INTO ticktrack_infectionindicatorslog (symptomlog_id, newinfectionindicators_id)
VALUES
    (1, 1),
    (1, 2),
    (3, 3);

INSERT INTO ticktrack_symptomsdetail (symptomlog_id, symptoms_id, severity_id)
VALUES
    (1, 2, 3),
    (1, 3, 1),
    (1, 4, 2),
    (1, 5, 1),
    (1, 6, 4),
    (1, 7, 2),
    (2, 1, 3),
    (2, 8, 2),
    (2, 9, 2),
    (2, 2, 2),
    (2, 3, 4),
    (2, 7, 2),
    (3, 11, 3),
    (3, 3, 3),
    (3, 24, 2),
    (3, 55, 3),
    (3, 16, 4),
    (3, 27, 2),
    (4, 2, 3),
    (4, 3, 1),
    (4, 4, 2),
    (4, 5, 1),
    (5, 6, 4),
    (5, 7, 2),
    (5, 1, 3),
    (6, 8, 2),
    (6, 9, 2),
    (7, 2, 2),
    (7, 3, 4),
    (7, 7, 2),
    (8, 11, 3),
    (8, 3, 3),
    (8, 24, 2),
    (9, 55, 3),
    (9, 16, 4),
    (9, 27, 2);

COMMIT;
