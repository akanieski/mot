IF EXISTS(select * from sys.databases where name='<%= dbName %>')
    DROP DATABASE <%= dbName %>
CREATE DATABASE <%= dbName %>