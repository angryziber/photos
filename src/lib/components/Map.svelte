<script lang="ts">
  import {onMount} from 'svelte'
  import type {Album} from '$lib/album_loader'

  let {albums, class: className, hoveredAlbum}: {albums: Album[], class?: string, hoveredAlbum?: Album} = $props()

  let mapElement: HTMLElement
  let map: google.maps.Map

  const initialZoom = 1.5
  const initialCenter = {lat: 20, lng: 0}

  onMount(() => {
    if (window['google']?.['maps']) {
      initMap()
      return
    }

    window['initMap'] = initMap
    const key = 'AIzaSyBgn7wSYI8l-JD1X2LAJUqIUfWX9ezLoIA'
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
    script.async = true
    script.defer = true

    document.head.appendChild(script)
  })

  $effect(() => {
    if (!map) return
    if (hoveredAlbum) {
      map.setZoom(4)
      map.panTo(hoveredAlbum)
    } else {
      map.setZoom(initialZoom)
      map.panTo(initialCenter)
    }
  })

  function initMap() {
    map = new google.maps.Map(mapElement, {
      zoom: 1.5,
      center: {lat: 20, lng: 0},
      mapTypeId: google.maps.MapTypeId.HYBRID,
      streetViewControl: false,
      zoomControl: false,
      panControl: false,
      mapTypeControl: false,
      backgroundColor: '#3e5e89',
    })

    albums.forEach(album => {
      const marker = new google.maps.Marker({
        position: album,
        map,
        title: album.title,
      })

      marker.addListener('click', () => {
        location.href = album.photosUrl
      })
    })
  }
</script>

<div class="w-full overflow-hidden shadow-md {className}" bind:this={mapElement}></div>
