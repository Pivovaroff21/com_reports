
<template>
  <div>
    <div class="flex">
      <button :class="{'active':activePageKey == 'html'}" @click="changeTo('html')">
        HTML
      </button>
      <button  :class="{'active':activePageKey == 'accessibility'}" @click="changeTo('accessibility')">
        Accessebility
      </button >
      <button  :class="{'active':activePageKey == 'cybersecurity'}" @click="changeTo('cybersecurity')">
        Cyber Security
      </button>
      <button  :class="{'active':activePageKey == 'seo'}" @click="changeTo('seo')">
        Seo
      </button>
      <button  :class="{'active':activePageKey == 'eat'}" @click="changeTo('eat')">
        E-A-T
      </button>
      <button  :class="{'active':activePageKey == 'ux'}" @click="changeTo('ux')">
        UX
      </button>
    </div>

    <ReportComponent v-for="report,key in reports" :key="key" v-show="key==activePageKey" :prompt="report.prompt" :title="report.title"/>
  </div>
</template>

<script>
import ReportComponent from '../components/ReportComponent.vue';
export default {
  name: 'ReportsView',
  components: {
    ReportComponent,
  },
  data() {
    return {
      activePageKey:'html',
      reports: {
        'html': {
          title: 'HTML Problems',
          prompt: 'check problem in code.'
        },
        'accessibility': {
          title: 'Accessibility Issues',
          prompt: 'Check accessibility problem in code.'
        },
        'seo': {
          title: 'SEO Problems',
          prompt: 'Check problem in seo code.'
        },
        'cybersecurity': {
          title: 'Cybersecurity Concerns',
          prompt: 'Check problem in cyber security.'
        },
        'eat': {
          title: 'E-A-T Concerns',
          prompt: 'Check problem in Expertise, Authoritativeness, and Trustworthiness (E-A-T) factors.'
        },
        'ux': {
          title: 'UX Concerns',
          prompt: 'Check UX problems. '
        }
      },
    };
  },
  created(){
    this.changeTo('html');
  },

  methods: {
    changeTo(key){
      this.activePageKey = key;
    }
  }


};
</script>

<style lang="scss" scoped>

  .flex{
    padding:20px;
    display: flex;
    align-items: center;
    gap:20px;
    button{
      padding: 10px 15px; 
      border: none; 
      border-radius: 5px; 
      background-color: #294254; 
      color: white; 
      cursor: pointer; 
      transition: background-color 0.3s;
      &.active{
        background-color: #0056b3; 
      } 
    }  
    button:hover {
      background-color: #0056b3; 
    }
  }

</style>