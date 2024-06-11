FROM ubuntu:latest
 
RUN apt update
 
RUN apt install openjdk-17-jdk -y
 
RUN apt install maven -y
 
WORKDIR /expensetracker
 
COPY . /expensetracker/
 
ENTRYPOINT [ "mvn","spring-boot:run" ]