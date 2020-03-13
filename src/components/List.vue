<template>
    <v-container>
        <v-card elevation-10>
            <v-list two-line>
                <template>
                    <v-subheader>마스크 판매처</v-subheader>
                    <v-divider></v-divider>
                    <div v-for="(item,index) in storesByGeoData.stores" :key="index">
                        <v-list-item class="elevation-3 mb-1" :class="remain_stat2Color(item.remain_stat)" @click="openSellerInfo(item)">
                            <v-icon class="mr-3" v-text="type2Icon(item.type)">mdi-pharmacy</v-icon>
                            
                            <v-list-item-content>
                              <div>
                              <v-badge
                            offset-y="19"
                            offset-x="-3"
                            :content="remain_stat2Text(item.remain_stat)"
                            :color="remain_stat2BadgeColor(item.remain_stat)"
                            >
                                <v-list-item-title :class="remain_stat2TextColor(item.remain_stat)" v-text="item.name" :aa="index"></v-list-item-title>
                                
                            </v-badge>
                            </div>
                                <v-list-item-subtitle :class="remain_stat2TextColor(item.remain_stat)" v-text="item.addr"></v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </div>
                </template>
            </v-list>
        </v-card>
    </v-container>
</template>

<script>
    import axios from 'axios';

    export default {

        props: {
            storesByGeoData:{},
            location:{},
            openSellerInfo:{ type: Function, },

        },
        data() {
            return {

            }
        },
        methods: {
            getStoresByGeo: function(lat, lng){
                axios.get('https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat='+ lat +'&lng='+ lng +'&m='+this.Level2Range(this.map.getLevel())) 
                .then(res => {
                  for(var i=0;i<res.data.count;i++){
                    //
                  }
                })
            },
            remain_stat2TextColor(stat){
                switch(stat){
                  case 'few':
                    return 'red--text text--darken-3';
                  case 'some':
                    return 'yellow--text text--darken-4';
                  case 'plenty':
                    return 'green--text text--darken-3';
                  default:
                    return 'grey--text text--darken-1';
                }  
            },
            remain_stat2BadgeColor(stat){
                switch(stat){
                  case 'few':
                    return 'red darken-3';
                  case 'some':
                    return 'yellow darken-4';
                  case 'plenty':
                    return 'green darken-3';
                  default:
                    return 'grey darken-1';
                }  
            },
            remain_stat2Color(stat){
                switch(stat){
                  case 'few':
                    return 'red lighten-4';
                  case 'some':
                    return 'yellow lighten-4';
                  case 'plenty':
                    return 'green lighten-4';
                  default:
                    return 'grey lighten-1';
                }  
            },
            remain_stat2Text(stat){
                switch(stat){
                  case 'few':
                    return '2 ~ 29';
                  case 'some':
                    return '30 ~ 99';
                  case 'plenty':
                    return '100 ~';
                  case 'empty':
                    return '0 ~ 1';
                  default:
                    return '알수없음';
                }  
            },
            type2Icon(type){
                switch(type){
                    case '01':
                        return 'mdi-pharmacy';
                    case '02':
                        return 'mdi-mailbox-open';
                    case '03':
                        return 'mdi-bank';
                }
            }
        },
    }
</script>