<template>
  <div class="report-component">
    <h2>{{ title }}</h2>
    <input v-model="pageUrl" placeholder="Input site URL" />
    <div class="error" v-if="error">
      {{ error }}  
    </div>

    <button @click="getReport">
      <span>
        Get Report
      </span>

      <span class="loader" v-if="isLoading"></span>
    </button>

    
    <div class="report" v-if="responses.length > 0">
      <vue-markdown
        v-for="report,index in responses"
        :key="index"
        :source="report"
        :options="markdownOptions"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api';
import axios from 'axios';
import VueMarkdown from 'vue-markdown-render';
import hljs from 'highlight.js' 
import 'highlight.js/styles/github.css'; 
import { isWithinTokenLimit} from 'gpt-tokenizer';
export default {
  name: 'ReportComponent',
  components: {
    VueMarkdown,
  },
  data() {
    return {
      tokenlimit:8192,
      isLoading:false,
      responses: [],
      pageUrl: '',
      error:'',
      markdownOptions: {
        highlight: (str, lang) => {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return hljs.highlight(str, { language: lang }).value;
              } catch (err) {
                console.error(err);
              }
            }

            return hljs.highlightAuto(str).value; 
          },
      },
    };
  },

  props: {
    prompt: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  methods: {
    minifyHtml(html) {
      return html
        .replace(/\n/g, '')          
        .replace(/\s{2,}/g, ' ')         
    },
    async getReport() {
      this.error = '';
      this.isLoading = true;
      let html = "";

      if(!this.pageUrl.includes('http://') && !this.pageUrl.includes('https://')){
        this.error = "Not valid page";
        this.isLoading = false;
        return
      }

      try{
        const response = await axios.get(this.pageUrl);
        html = this.minifyHtml(response.data);

      }catch(e){
        this.error = "Couldn't get html of your page. Only current site pages are available.";
        this.isLoading = false;
        return
      }

      if(isWithinTokenLimit(html,this.tokenlimit) == false){
        await this.splitReport(html);
      }else{
        await this.basicReport(html);
      }

      if(this.responses){
        this.isLoading = false;
      }

    },
    async basicReport(html){
        const messages = [
          {
            role: 'user',
            content: `${this.prompt} Provide suggestions for improvement and code examples. ${html}`,
          },
        ];

        const options = {
          model: 'gpt-4',
          temperature: 0.4,
        };
        const choices = await api.createChatCompletion(messages, options);
        this.responses.push(choices[0].message.content); 
    },

    async splitReport(html) {
        let parts = [];
        let part_size = 2;
        const str_len = html.length;
        let allPartsValid = false;
        const combinedResponse = [];

        while (!allPartsValid) {
            const tempParts = [];
            allPartsValid = true;
            const sizePerPart = Math.ceil(str_len / part_size);

            for (let i = 0; i < part_size; i++) {
                const start = i * sizePerPart;
                const end = Math.min(start + sizePerPart, str_len);
                const part = html.slice(start, end);
                tempParts.push(part);
            }

            for (let i = 0; i < tempParts.length; i++) {
                if (!isWithinTokenLimit(tempParts[i], this.tokenlimit)) {
                    allPartsValid = false;
                    part_size++;
                    break;
                }
            }
            parts = tempParts;
        }

        const options = {
            model: 'gpt-4',
            temperature: 0.4,
        };

       
        // Iterate over the parts and send them to the API
        for (let i = 0; i < parts.length; i++) {
            const partPrompt = i === 0 ? 
                `This is part ${i + 1} of the HTML. ${this.prompt}. Provide suggestions for improvement and code examples. More parts will follow.` : 
                i === parts.length - 1 ? 
                    `This is the last part of the HTML. Combine this with previous parts. Provide final improvement suggestions.` :
                    `This is part ${i + 1} of the HTML. Continue examining the code. More parts will follow.`;

            const messages = [
                {
                    role: 'user',
                    content: `${partPrompt} ${parts[i]}`,
                },
            ];

            const choices = await api.createChatCompletion(messages, options);
            combinedResponse.push(choices[0].message.content);
        }

        const finalResponse = combinedResponse.join('\n');
        this.responses.push(finalResponse);

    }




  }
};
</script>

<style lang="scss" >

.report-component{

  .error{
    color:red;
    margin-bottom:20px;
  }
  box-sizing:border-box;
  padding:20px;
  .report {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd; 
    border-radius: 5px; 
    background-color: #fff; 
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); 
  }

  h2 {
    color: #333; 
    margin-bottom: 15px;
  }

  input {
    width:100%;
    margin-bottom:20px;
    padding: 10px;
    border: 1px solid #ccc; 
    border-radius: 5px; 
    margin-right: 10px;
  }

  button {
    display: flex;
    align-items: center;
    gap:10px;
    padding: 10px 15px; 
    border: none; 
    border-radius: 5px; 
    background-color: #294254; 
    color: white; 
    cursor: pointer; 
    transition: background-color 0.3s; 
  }

  button:hover {
    background-color: #0056b3; 
  }

  pre {
    background-color: #f5f5f5; 
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto; 
    white-space: pre-wrap;
    margin: 10px 0; 
  }



  ul {
    margin-left: 20px; 
  }

  li {
    margin-bottom: 5px; 
  }

  a {
    color: #294254; 
    text-decoration: none; 
  }

  a:hover {
    text-decoration: underline; 
  }

  blockquote {
    border-left: 3px solid #294254; 
    margin: 0;
    padding-left: 10px; 
    color: #666; 
    font-style: italic; 
  }

  .loader {
    width: 12px;
    height: 12px;
    border: 2px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
}

</style>

