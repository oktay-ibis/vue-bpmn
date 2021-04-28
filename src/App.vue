<template>
  <div id="app">
    <div class="header">
      <h2>Welcome to Mobven -  BPMN!</h2>
    </div>
    <div class="search-container">
      <div class="form-field">
        <input  v-model="search" id="searchBox" type="text">
        <label for="searchBox"></label>
      </div>
      <button @click="getXmlByProcessId">Go</button>
      <div>
        <button @click="create">Create New</button>
      </div>

    </div>
    <div v-if="xml" class="bpmn-container">
    <bpmn-viewer :list="list" :xml="xml"></bpmn-viewer>
    </div>
  </div>
</template>

<script>

import {getHistory, getProcessById, getProcessInstancesList, getXmlFile} from "@/service/http-services";
import BpmnViewer from "@/components/BpmnViewer";
import {xml} from "@/assets/xml";

export default {
  name: 'App',
  components: {BpmnViewer},
  mounted() {
    this.xml = xml;
    this.getProcessList()

  },
  data() {
    return {
      processDefinitionList: [],
      xml : null,
      search:'5bfc1647-8638-11eb-b9f5-0242ac110002',
      list:null,
    }
  },
  methods: {
    async getProcessList() {
   try {
     const response = await getProcessInstancesList()
       this.processDefinitionList = response.data
   }catch (e) {
     console.log(e)
   }
    },
    async getXmlByProcessId() {
      try {
        const response = await getProcessById(this.search)
        const process = response.data;
        const {definitionId} = process;
        const xmlResponse  = await getXmlFile(definitionId);
        this.xml = xmlResponse.data.bpmn20Xml
        const responseList = await getHistory(this.search);
        this.list = responseList.data
      } catch (e) {
        console.log(e)
      }
    },
    create(){
      this.xml = xml
    },
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.header {
  background-color: #2c3e50;
  color: white;
  padding: 10px;
}
</style>
