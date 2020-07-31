<template>
  <div class="custom-select" :tabindex="tabindex"  v-on-click-outside="onBlur">
    <div class="selected" :class="{open: open}" @click="clickOnSelect">
      <span v-if="selected && selected.text">{{ selected.text }} </span>
      <span v-else>Không tìm thấy dữ liệu</span>
      <div class="arrow"></div>
    </div>
    <div class="items" style="z-index:999;" :class="{selectHide: !open}">
      <div class="form-group" style="margin-bottom:0px;padding:4px 4px;width:100%;">
        <input type="text" ref="search" v-model="textToSearch" class="form-control" style="width:100%;padding:6px 4px;color:black;">
      </div>
      <div v-if="optionsToRender.length > 0" :class="{'is-scroll':optionsToRender.length > 8}">
        <div
          class="item"
          v-for="(option, i) of optionsToRender"
          :key="i"
          @click="selected=option; open=false; $emit('input', option)"
        >{{ option.text }}</div>
      </div>
      <div v-else>
        <div class="item-notfound">Không tìm thấy dữ liệu</div>
      </div>
      </div>
  </div>
</template>

<script>
import { mixin as onClickOutside } from 'vue-on-click-outside'
export default {
  mixins: [onClickOutside],
  name: "CustomSelect",
  props: {
    options: {
      type: Array,
      required: true
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0
    },
    chooseIndex: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      selected: this.options.length > 0 ? this.options[this.chooseIndex] : {text: "Không tìm thấy dữ liệu", value:null},
      open: false,
      hoverOption: false,
      optionsToRender: [],
      textToSearch:''
    };
  },
  mounted() {
   // this.$emit("input", this.selected);
    this.optionsToRender = this.options
  },
  methods: {
    clickOnSelect() {
      if (this.options.length > 0) {
        this.open = !this.open
        this.textToSearch = ''
        this.$nextTick(() => {
            this.$refs.search.focus()
        })
      }
     
    },
    onBlur() {
      this.open = false
    }
  },
  watch: {
    options: function(val) {
      this.selected = val.length > 0 ? val[this.chooseIndex] : {text: "Không tìm thấy dữ liệu", value:null}
    },
    textToSearch: function(val) {
      if (val.trim().length == 0) {
        this.optionsToRender = this.options
      } else {
        const n = this.options.length
        this.optionsToRender = []
        let searchText = val.trim().toLowerCase()
        searchText = nonAccentVietnamese(searchText)
        for (let i=0;i<n;i++) {
          if (nonAccentVietnamese(this.options[i].text.toLowerCase()).includes(searchText)) {
            this.optionsToRender.push(this.options[i])
          }
        }
        if (this.optionsToRender.length == 0) {
          // this.optionsToRender.push({
          //   text: "Không tìm thấy dữ liệu",
          //   value:null
          // })
        }
      }
    }
  }
};
function nonAccentVietnamese(str) {
    str = str.toLowerCase();

    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
 
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}
</script>

<style scoped>
    .custom-select {
        position: relative;
        width: 100%;
        text-align: left;
        outline: none;
        height: 35px;
        line-height: 35px;
    }

    .selected {
        background-color: #fff;
        border-radius: 3px;
        border: 1px solid #cfcfcf;
        color: black;
        padding-left: 8px;
        cursor: pointer;
        user-select: none;
    }

    .selected.open {
        border: 1px solid #ccc;
        border-radius: 3px 3px 0px 0px;
    }

    /* .selected:after {
        position: absolute;
        content: "";
        top: 17px;
        right: 10px;
        width: 0px;
        height: 0px;
        border: 6px solid black;
        border-color: black transparent transparent transparent;
    } */

        .arrow {
            position: absolute;
            height: 7px;
            width: 7px;
            right:8px;
            top: 16px;
        }
        .arrow::before, .arrow::after {
            content: "";
            position: absolute;
            bottom: 0px;
            width: 2px;
            height: 100%;
            transition: all 0.5s;
        }
        .arrow::before {
            left: 0px;
            transform: rotate(-46deg);
            background-color: #555555;
        }
        .arrow::after {
            left: 4.5px;
            transform: rotate(46deg);
            background-color: #555555;
        }

        .open  .arrow::before {
            left: 0px;
            transform: rotate(46deg);
            background-color: #555555;
        }

        .open  .arrow::after {
            left: 4.5px;
            transform: rotate(-46deg);
            background-color: #555555;
        }

    .items {
        color: #ffffff;
        border-radius: 0px 0px 3px 3px;
        overflow: hidden;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: absolute;
        background-color: white;
        left: 0;
        right: 0;
    }

    .item {
      color: black;
      padding-left: 8px;
      cursor: pointer;
      user-select: none;
    }

    .item-notfound{
      color: black;
      padding-left: 8px;
      cursor: pointer;
      user-select: none;
      font-style: italic;
    }

    .item:hover {
        background-color: #0A6EB7;
        color: #fff;
    }

    .selectHide {
        display: none;
    }

   /* width */
    ::-webkit-scrollbar {
        width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 4px;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        opacity: 0.2;
        border-radius: 10px;
        background: #ff8833; 
    }

    .is-scroll {
      height: 250px;overflow-y: scroll;
      z-index: 999;
    }

</style>