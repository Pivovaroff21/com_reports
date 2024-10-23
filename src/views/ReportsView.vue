
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
          prompt: 'Check code for problems in HTML and give improvements and code examples.'
        },
        'accessibility': {
          title: 'Accessibility Issues',
          prompt: 'Analyze the code for accessibility problems, such as missing alt attributes, improper use of headings, and other factors affecting users with disabilities. Provide suggestions for improvement and code examples.'
        },
        'seo': {
          title: 'SEO Problems',
          prompt: 'Review the code for SEO-related issues like missing or duplicate title tags, meta descriptions, and header tags. Provide recommendations for improvement and code examples.'
        },
        'cybersecurity': {
          title: 'Cybersecurity Concerns',
          prompt: 'Examine the code for potential cybersecurity vulnerabilities, including improperly handled user inputs and missing security headers. Suggest enhancements to improve security and code examples.'
        },
        'eat': {
          title: 'E-A-T Concerns',
          prompt: 'Evaluate the code for Expertise, Authoritativeness, and Trustworthiness (E-A-T) factors that might affect credibility and trust in the website. Provide suggestions for improvement and code examples.'
        },
        'ux': {
          title: 'UX Concerns',
          prompt: 'Examine the code for potential UX problems, including user input handling, intuitive navigation, and accessibility. Suggest improvements to enhance user experience and provide code examples.'
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