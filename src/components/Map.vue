<template>
  <div>
    <vue-daum-map
    :appKey="appKey"
    :center.sync="center"
    :level.sync="level"
    :mapTypeId="mapTypeId"
    :libraries="libraries"
    @load="onLoad"
    style="width:100%;height:100%"/>
    <!-- <v-btn @click="getStoresByGeo_Center" elevation="10" style="position:absolute;top:0;z-index:999;">aa</v-btn> -->
  </div>
</template>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6f428547f8ff26402d2ede8daa8b240c"></script>

<script>
  import VueDaumMap from 'vue-daum-map';
  export default {
    name: 'Map',

    components:{
      VueDaumMap,
    },
    
    props: {
      getStoresByGeoParent: {type: Function},
      location:{},
    },

    data: () => ({
      appKey: '6f428547f8ff26402d2ede8daa8b240c',
      center: {lat:33.450701, lng:126.570667},
      level: 4, 
      mapTypeId: VueDaumMap.MapTypeId.NORMAL, 
      libraries: [],
      map: null,
      centerMarker:null,
      centerCircle:null,
      markerArray:[],

    }),

    methods: {
      getStoresByGeo(a,b){
        this.getStoresByGeoParent(a,b);
      },
      // 지도가 로드 완료되면 load 이벤트 발생
      onLoad (map) {
        this.map = map;
        if(this.location){
          this.setCenter();
        }
        var ref=this;
        var startLat,startLng,startLevel;
        kakao.maps.event.addListener(map, 'dragend', function() {
          ref.getStoresByGeo(map.getCenter().getLat(),map.getCenter().getLng());
        });
        kakao.maps.event.addListener(map, 'zoom_start', function() {
          startLat=map.getCenter().getLat();
          startLng=map.getCenter().getLng();
          startLevel=map.getLevel();
        });
        kakao.maps.event.addListener(map, 'zoom_changed', function() {
          if(map.getLevel()>startLevel)
            map.setCenter(new kakao.maps.LatLng(startLat,startLng));
          else
            ref.getStoresByGeo(map.getCenter().getLat(),map.getCenter().getLng());
        });
      },

      setCenter: function(){
        if(!this.location) {return;}
        if(this.centerMarker) this.centerMarker.setMap(null);
        this.map.setLevel(4);
        this.map.setCenter(new kakao.maps.LatLng(this.location.coords.latitude,this.location.coords.longitude));
        var imageSrc = require('@/assets/person_pin_24px_red.svg'),  
            imageSize = new kakao.maps.Size(36, 36);
        var markerImage = new kakao.maps.MarkerImage(imageSrc,imageSize,{});
        this.centerMarker = new kakao.maps.Marker({ 
          position: this.map.getCenter(),
          image: markerImage
        });
        this.centerMarker.setMap(this.map);
        this.getStoresByGeo(this.map.getCenter().getLat(),this.map.getCenter().getLng());
      },

      
    },

    

  }
</script>
