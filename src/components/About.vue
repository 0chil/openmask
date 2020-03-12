<template>
    <v-container>
        <v-alert type="info" class="mt-2">
            이 앱은 공공데이터포털에서 제공하는 OPEN API를 사용합니다.
        </v-alert>
        <v-card>
          <v-list two-line>
            <template>
              <v-subheader>DEVELOPERS</v-subheader>
              <v-divider></v-divider>
              <div v-for="(item,index) in items" :key="index">
                <v-list-item>
                  <v-list-item-avatar>
                    <img :src="item.avatar">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="item.title"></v-list-item-title>
                    <v-list-item-subtitle v-html="item.id"></v-list-item-subtitle>
                    <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider/>
              </div>
            </template>
          </v-list>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                items:[
                    {avatar:'https://avatars2.githubusercontent.com/u/39221443?s=400&u=abd3d5f7f155217ddf49a23e3b05ed76fa85f683&v=4',title:'박성철',id:'goraegori',subtitle:'나 혼자야...?ㅠㅠ'},
                    {avatar:'https://avatars3.githubusercontent.com/u/39258902?s=460&v=4',title:'허예은',id:'yeahsilver',subtitle:'나도 있지렁'},
                ]
            }
        },
    }
</script>