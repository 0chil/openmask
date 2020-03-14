<template>
        <v-overlay v-model="notice">
            <v-card light>
                <v-card-title>
                    OPENMASK
                </v-card-title>
                <v-card-text>{{ msg }}
                </v-card-text>
                <v-card-actions>
                    <v-btn
                        text
                        color="primary"
                        @click="closeMsg"
                    >
                        닫기
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="closeMsgForToday"
                    >
                        24시간 닫기
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-overlay>
</template>

<script>
    export default {
        data: () => ({
                notice: true,
                msg:'Beta'
            }
        ),
        methods: {
            closeMsg:function() {
                this.notice = false;
            },
            closeMsgForToday:function() {
                this.notice = false;
                this.$cookies.set('todayClose','Y', 86400);
            }
        },
        mounted(){
            if(this.$cookies.get('todayClose')=="Y"){
                this.notice=false;
            }
        }
    }
</script>