<template>
<div class="bpm-viewer">
  <h2>Bpm Viwer</h2>
  <div class="actions">
    <button @click="saveSVG">Save SVG</button>
    <button @click="changeScreen">Show XML</button>
    <button @click="saveBpmnFile">Save BPMN File</button>
  </div>
  <div v-show="isDisplayedXml"><code  contenteditable="true">{{bpmnXml}}</code></div>
  <div  v-show="!isDisplayedXml" ref="bpmn" class="main-container"></div>
</div>
</template>

<script>
import BpmnJS from "bpmn-js/dist/bpmn-modeler.development.js";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
export default {
  name: "BpmnViewer",
  mounted() {
     this.container = this.$refs.bpmn;
     this.bpmnXml = this.xml
    // eslint-disable-next-line no-undef
    this.viewer =new BpmnJS({
      container:this.container
    });
    this.renderXMl();
  },
  destroyed() {
    this.viewer.destroy();
  },
  data() {
    return {
      viewer: "",
      isDisplayedXml:false,
      container: null,
      bpmnXml:null
    }
  },
  props: {
    xml: {
      type: String,
    },
    list: {
      type: Array
    },
    activityId:String
  },
  methods: {
    async renderXMl() {
      try {
        await this.viewer.importXML(this.bpmnXml);
       // this.list.forEach(a => this.renderOverlays(a))
      } catch (e) {
        console.log(e)
      }
    },
    renderOverlays(activity){
      // get activity
      // each activity has a endTime and startTime
      // find the activitiy in the list, and count times key.
      const modeling = this.viewer.get('modeling');
     const filteredStartTime = this.list.filter(a =>a.activityId === activity.activityId && a.startTime !== null).length
      const filterEndTime = this.list.filter(a => a.activityId === activity.activityId&&a.endTime !== null).length
      const isActive = filteredStartTime > filterEndTime
      if(isActive){
        modeling.setColor(activity, {
          stroke:'white',
          fill:'green'
        })
      }
      const overlayHtml =`<div style="width: 50px; background-color: ${isActive ? 'green': 'lightblue'}; text-align: center; font-size: 0.6rem; color: ${isActive ? 'white' : 'black'}">${filteredStartTime} / ${filterEndTime}</div>`
      const overlays = this.viewer.get('overlays');
      overlays.add(activity.activityId, {
        position: {
          bottom: 0,
          left: 10,
        },
        html:overlayHtml
      })
    },
    async saveSVG(){
     try {
       const {svg} = await this.viewer.saveSVG();
       const blob = new Blob([svg], {type:'svg'});
       const downloadEl = document.createElement('a');
       downloadEl.setAttribute('href', window.URL.createObjectURL(blob));
       downloadEl.setAttribute('download','save.svg');
       downloadEl.click();
     }catch (e) {
       console.log(e)
     }
    },

    async saveBpmnFile(){
      const {xml} = await this.viewer.saveXML()
      const blob = new Blob([xml], {type:'xml'});
      const downloadEl = document.createElement('a');
      downloadEl.setAttribute('href', window.URL.createObjectURL(blob));
      downloadEl.setAttribute('download','save.bpmn');
      downloadEl.click();
    },
    async changeScreen(){
      const {xml} = await this.viewer.saveXML()
      this.bpmnXml=xml
      this.isDisplayedXml = !this.isDisplayedXml;
    }
  },
  watch: {
    list(newValue) {
      if(newValue) {
        newValue.forEach(a => this.renderOverlays(a))
      }

    },
    xml(newValue, oldValue){
      if(newValue !== oldValue) {
        this.bpmnXml = newValue;
        this.renderXMl();
      }

    },
     isDisplayedXml(newValue) {
      if(newValue) {
      setTimeout(()=> this.renderXMl(), 100)
      }
    }
  },
}
</script>

<style scoped>
.main-container {
  border: 1px dashed black;
  margin: 10px auto;
  height: 700px;
}
</style>
