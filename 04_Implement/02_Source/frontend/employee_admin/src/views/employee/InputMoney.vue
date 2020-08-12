<template>
    <div :style="styleData">
        <CInput type="text" v-model="number"  invalid-feedback="Please enter a valid money" :is-valid="verifyMoney" />
    </div>
</template>

<script>
import {formatMoney} from "@/utils/convert"
export default {
    name: "InputMoney",
    data: function() {
        return {
            number: '50.000',
            realValue: 50000
        }
    },
    methods: {
        getRealValue() {
            return this.realValue
        },
        setRealValue(value) {
            this.realValue = value
            this.number = this.realValue.toString()
        },
        verifyMoney() {
            return this.realValue >= 50000
        }
    },
    watch: {
        number() {
            if (this.number.length > 0) {
                this.number = this.number.replace(/[^0-9]/g,'')
                let intData = parseInt(this.number)

                if (isNaN(intData)) {
                    this.number = '0'
                    this.realValue = 0
                    return
                }

                this.number = formatMoney(intData)
                this.realValue = intData
            }
        }
    },
    props: [
        'styleData'
    ]
}
</script>