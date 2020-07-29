<template>
    <div>
        <div class="modal fade" id="modal-create-staff" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Create new staff</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="step==1" >
                            <!-- <div style="padding-top: 10px; padding-bottom: 10px;padding-left: 20px; padding-right: 20px;background-color:#2eb85c;height: 75px;">
                                <table>
                                    <tbody class="tbody-table">
                                        <tr>
                                            <td style="font-size: 25px;width: 35px;">1</td>
                                            <td style="background-color: #fff;width:">
                                            
                                            </td>
                                            <td style="padding-left:15px;">
                                                <span style="font-size:18px;">Sign-in information</span><br>
                                                <span>Provide the sign-in information</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> -->
                            <CInput
                                label="Email"
                                placeholder="Enter the sign-in email"
                                v-model="email"
                                style="margin-bottom:10px;"
                            />
                            <CInput
                                label="Fullname"
                                placeholder="Enter full name"
                                v-model="fullName"
                                style="margin-bottom:10px;"
                            />
                            <CInput
                                label="Phone number"
                                placeholder="Enter phone number"
                                v-model="phoneNumber"
                                style="margin-bottom:10px;"
                            />
                           <CRow style="margin-bottom: 5px;">
                                <CCol>
                                    Choose type
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol style="padding-left:0px;">
                                    <CInputRadioGroup
                                        class="col-sm-12"
                                        :options="options"
                                        :custom="true"
                                        :checked="'Employee'"
                                        :inline="true"
                                        @update:checked="onChangeType"
                                    />
                                </CCol>
                            </CRow>
                        </div>
                        <div v-else>
                            <div>
                                <CRow>
                                    <CCol lg="12" md="12" sm="12">
                                        <label>An account has successfully been created! The account's details below</label>

                                        <label style="margin-top:5px;margin-bottom:5px;">Sign-in information</label>
                                        <div style="background-color:#ddd;height:73px;padding:10px;">
                                            <label><span>Username:</span><span style="margin-left:73px;">{{username}}</span></label><br>
                                            <label><span>Password:</span><span style="margin-left:76px;">{{password}}</span></label>
                                        </div>
                                        <label style="margin-top:15px;margin-bottom:5px;">Personal information</label>
                                        <div style="background-color:#ddd;height:130px;padding:10px;">
                                            <label><span>Fullname:</span><span style="margin-left:80px;">{{fullName}}</span></label><br>
                                            <label><span>Phone number:</span><span style="margin-left:44px;">{{phoneNumber}}</span></label><br>
                                            <label><span>Email:</span><span style="margin-left:102px">{{email}}</span></label><br>
                                            <label><span>Position:</span><span style="margin-left:85px">{{currentType}}</span></label>
                                        </div>
                                    </CCol>
                                </CRow>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary"  v-if="step==1" @click="hideModal">Cancel</button>
                        <button type="button" class="btn btn-success" v-if="step==1" @click="createStaff">Next</button>
                        <button type="button" class="btn btn-success" v-else @click="hideModal">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "CreateStaff",
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
            password: ''
        }
    },
    methods: {
        showModal() {
            this.step = 1
            $("#modal-create-staff").modal('show')
        },
        async createStaff() {
            let payload = {
                data: {
                    fullName: this.fullName,
                    email: this.email,
                    phoneNumber: this.phoneNumber,
                    positionRegister: this.currentType
                }
            }

            let response = await this.$store.dispatch("admin/createStaff", payload)
            if (response && !response.error) {
                this.step++
                let data=  response.data.data
                this.username = data.username
                this.password = data.password
            } else {
                alert("Something went wrong")
            }
        },
        hideModal() {
            $("#modal-create-staff").modal('hide')
            this.step = 1
        },
        onChangeType(value,e) {
            if (value == 'Employee') {
                this.currentType = 'EMPLOYEE'
            } else {
                this.currentType = 'ADMINISTRATOR'
            }
        }
    }
}
</script>