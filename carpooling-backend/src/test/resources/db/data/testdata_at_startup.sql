-- this test data uses
INSERT INTO user_table (username, email, password)
VALUES ('alice', 'alice@example.com', 'password1'),
       ('bob', 'bob@example.com', 'password2'),
       ('charlie', 'charlie@example.com', 'password3')
ON CONFLICT DO NOTHING;