CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    age INTEGER
);

INSERT INTO people (name, age) VALUES ('John', 25);
INSERT INTO people (name, age) VALUES ('Jane', 30);
INSERT INTO people (name, age) VALUES ('Bob', 35);