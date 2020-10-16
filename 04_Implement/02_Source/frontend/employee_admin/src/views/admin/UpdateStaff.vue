<template>
    <div>
        <div class="modal fade" id="modal-update-info" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Update info</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="step==1" >
                            <CInput
                                label="Email"
                                v-model="email"
                                style="margin-bottom:10px;"
                                type="email"
                                required
                                was-validated
                                invalid-feedback="Please enter a valid email"
                                autocomplete="email"
                            />
                            <CInput
                                label="Full name"
                                v-model="fullName"
                                style="margin-bottom:10px;"
                                required
                                was-validated
                                type="text"
                            />
                            <CInput
                                label="Phone number"
                                v-model="phoneNumber"
                                style="margin-bottom:10px;"
                                disabled
                            />
                            <CInput
                                label="Position"
                                v-model="position"
                                style="margin-bottom:10px;"
                                disabled
                            />
                        </div>
                        <div v-else>
                            <div>
                                <CRow>
                                    <CCol lg="12">
                                        <span style="font-size: 18px;">Update info successfully</span>
                                    </CCol>
                                </CRow>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"  v-if="step==1" @click="hideModal">Cancel</button>
                        <button type="button" class="btn btn-success" v-if="step==1" @click="doAction">Update</button>
                        <button type="button" class="btn btn-success" v-else @click="hideModal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {validateEmail,isVietnamesePhoneNumber} from "@/utils/check.js"
export default {
    name: "UpdateStaff",
    data: function() {
        return {
            step: 1,
            fullName: '',
            email: '',
            phoneNumber: '',
            options: ['Employee', 'Admin'],
            radioNames: ['Choose type'],
            currentType: 'EMPLOYEE',
            username: '',
            password: '',
            newPassword:'',
            backUpEmail: '',
            backUpFullName: '',
            position: ''
        }
    },
    methods: {
        showModal(value) {
            this.step = 1
            this.fullName = value.full_name
            this.email = value.email
            this.phoneNumber = value.phone_number
            this.position = value.position
            this.username = value.username

            this.backUpEmail = this.email
            this.backUpFullName = this.fullName

            $("#modal-update-info").modal('show')
        },
        async doAction() {

            if (!validateEmail(this.email)) {
                return
            }

            if (this.fullName == "") {
                return
            }

            let payload = {
                data: {
                    username: this.username
                }
            }

            let needUpdate = false

            if (this.email != this.backUpEmail) {
                payload.data.email = this.email
                needUpdate = true
            }

            if (this.fullName != this.backUpFullName) {
                payload.data.fullName = this.fullName
                needUpdate = true
            }

            if (needUpdate) {
                let response = await this.$store.dispatch("admin/updateStaffInfo", payload)
                if (response && !response.error) {
                    // this.newPassword = response.data.data.password
                    this.step++
                    return
                } else {
                    if (response && response.error && response.error.response && response.error.response.data && response.error.response.data.errors && response.error.response.data.errors[0]) {
                        alert(response.error.response.data.errors[0].msg);
                    } else {
                        alert("Something went wrong")
                    }
                    return
                }
            }
            this.step++
        },
        hideModal() {
            $("#modal-update-info").modal('hide')
            this.$emit("reloadDataAfterUpdateInfo")
        },
    }
}
</script>