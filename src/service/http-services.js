import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/camunda/api/engine/engine/default/"
});

export function getProcessInstancesList(){
    return http.get("/process-instance");
}

export function getProcessById(id) {
    return http.get("/process-instance/"+id)

}

export function getProcessDefinitionsList(){
    return http.get("/process-definition");

}

export function getXmlFile(id) {
    return http.get("/process-definition/"+id +"/xml")

}

export function getHistory(id) {
    return http.get("/history/activity-instance?processInstanceId="+id)
}
