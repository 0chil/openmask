<template>
    <div>
        <v-bottom-sheet v-model="notice" inset >
            <v-sheet class="text-center" height="120px">
                <v-btn
                    class="mt-3"
                    text
                    color="primary"
                    @click="closeMsg"
                >
                    닫기
                </v-btn>
                <v-btn
                    class="mt-3"
                    text
                    color="primary"
                    @click="closeMsgForToday"
                >
                    24시간 닫기
                </v-btn>
                <div class="my-3">{{ msg }}</div>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                notice: true,
                msg:'Beta'
            }
        },
        methods: {
            closeMsg:function() {
                this.notice = !this.notice;
            },
            closeMsgForToday:function() {
                this.notice = !this.notice;
                this.$cookies.set('todayClose','Y', 86400);
            }
        },
        mounted(){
            if(this.$cookies.get('todayClose')=="Y")
                this.notice=false;
        }
    }
</script>