To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user

In the MySQL CLI:

```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```

**Note:** Replace _sakila_ with the name of the database you want the user to have access to

```
FLUSH PRIVILEGES;
```

```
DEPENDENCIES;
```

Express,
wax-on,
hbs,
dotenv




For react
WDS_SOCKET_PORT=0 for react . to 
