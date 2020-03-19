<template>
  <div>
        <div style="position:absolute;z-index:99;right:0;">
          <v-btn class="mt-1 mr-1" icon text :color="filterEnabled?'dark':'primary'" @click="filterEnabled=!filterEnabled"><v-icon large>mdi-map-marker</v-icon></v-btn>
          <br><b :class="filterEnabled?'dark--text':'primary--text'">0~1</b>
          <!-- <v-checkbox on-icon="" off-icon="" inset class="mt-1" v-model="filterEnabled" messages="0~1"/> -->
        </div>
    <div
    ref="map2"
    style="width:100%;height:100%"
    />
  </div>
</template>
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c&autoload=false"></script>
<script>

  export default {
    name: 'Map',

    components:{
      
    },
    
    props: {
      getStoresByGeo: {type: Function},
      runFilter:{type:Function},
      showSellerInfo:{},
      activeBtn:{},
    },

    data: () => ({
      filterEnabled:true,

      map: null,
      centerMarker:null,
      centerCircle:null,

      location:null,
      gettingLocation: false,
      errorStr:null,

      centerMarkerSrc:require('@/assets/person_pin_24px_red.svg'),  
      centerMarkerSize:null,
      centerMarkerImage:null,
    }),
    watch:{
      activeBtn(num){
        if(num==1)
          this.relayout();
      },
      filterEnabled(bool){
        this.runFilter(bool);
      }
    },
    mounted(){
      let kakaomapScript = document.createElement('script');
      kakaomapScript.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c&autoload=false');
      document.head.appendChild(kakaomapScript);
      
      var refthis=this;
      document.onreadystatechange = () => {
        if (document.readyState == "complete") {
          kakao.maps.load(function() {
            refthis.centerMarkerSize=new kakao.maps.Size(36, 36);
            refthis.centerMarkerImage=new kakao.maps.MarkerImage(refthis.centerMarkerSrc,refthis.centerMarkerSize,{});

            refthis.loadMap();
          });
        }
      }
      
      
      this.getLocation();
    },

    methods: {
      relayout(){
        this.map.relayout();
      },
      loadMap(){
        var option = { 
          center: new kakao.maps.LatLng(33.450701, 126.570667),
          level: 3, 
        };
        var map=new kakao.maps.Map(this.$refs.map2,option);
        this.map= map;
        this.onLoad(map);
      },

      onLoad (map) {
        //this.map = map;
        map.setMaxLevel(7);
        if(this.location){
          this.setCenter();
        }
        
        var thisref=this;
        var startCenter,startLevel;

        kakao.maps.event.addListener(map, 'dragend', function() {
          thisref.getStoresByGeo(map.getCenter().getLat(),map.getCenter().getLng());
        });

        kakao.maps.event.addListener(map, 'zoom_start', function() {
          startCenter= new kakao.maps.LatLng(map.getCenter().getLat(),map.getCenter().getLng());
          startLevel=map.getLevel(startCenter);
        });

        kakao.maps.event.addListener(map, 'zoom_changed', function() {
          if(map.getLevel()>startLevel)
            map.setCenter(startCenter);
          else
          thisref.getStoresByGeo(map.getCenter().getLat(),map.getCenter().getLng());
        });
      },

      getLocation(){
        if(!("geolocation" in navigator)) {
          this.errorStr = 'Geolocation is not available.';
          alert(this.errorStr);
          return;
        }
        this.gettingLocation = true;
        navigator.geolocation.getCurrentPosition(pos => {
          this.gettingLocation = false;
          this.location = pos;
          if(this.map) this.setCenter();
        }, err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
        })
      },

      setCenter(){
        if(this.gettingLocation) return;
        if(this.centerMarker) this.centerMarker.setMap(null);
        this.map.setLevel(4);
        this.map.setCenter(new kakao.maps.LatLng(this.location.coords.latitude,this.location.coords.longitude));
        
        this.centerMarker = new kakao.maps.Marker({ 
          position: this.map.getCenter(),
          image: this.centerMarkerImage,
        });
        this.centerMarker.setMap(this.map);
        this.getStoresByGeo(this.map.getCenter().getLat(),this.map.getCenter().getLng());
      },
    },
    
    

  }
</script>
