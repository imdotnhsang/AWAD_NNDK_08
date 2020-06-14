<template>
    <div class="basic-class" v-bind:style="{marginRight: mr+'px'}" v-bind:class="{'is-chosen':isChosenComputed}" @click="clickEvent">
        {{value}}
    </div>
</template>

<script>
export default {
    name: "Money",
    props: [
        'value',
        'isChosen',
        'mr'
    ],
    data() {
        return {
            
        }
    },
    methods: {
        clickEvent() {
           // this.isChosen = true
            this.$emit('click',this.value)
        }
    },
    computed: {
        isChosenComputed() {
            return this.isChosen
        }
     }
}
</script>

<style scoped>
    .is-chosen {
        background-color: #2eb85c;
        color: white;
    }
    .basic-class {
        width: 95px;
        border-radius: 4px;
        border: 1px solid #2eb85c;
        padding: 5px;
        text-align:center;
        cursor: pointer;
        display: inline-block;
    }
    .basic-class:hover {
        color: #fff;
        background-color: #2eb85c;
    }

    @media screen and (max-width: 991px){
          .basic-class {
            width: 100%;
            border-radius: 4px;
            border: 1px solid #2eb85c;
            padding: 5px;
            text-align:center;
            cursor: pointer;
            display: inline-block;
            margin-top: 10px;
        }
    }

</style>