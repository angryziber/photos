<script lang="ts">
  import type {PageData} from './$types'
  import Map from '$lib/components/Map.svelte'
  import type {Album} from '$lib/album_loader'
  import {fade, fly} from 'svelte/transition'
  import {pushState} from '$app/navigation'
  import {page} from '$app/state'
  import AlbumDetail from '$lib/components/AlbumDetail.svelte'

  let {data}: {data: PageData} = $props()
  let hoveredAlbum: Album | undefined = $state()

  let selectedAlbum = $derived((page.state as any).selectedAlbum)

  function openAlbum(album: Album) {
    pushState(album.id, {selectedAlbum: album})
  }

  function closeAlbum() {
    history.back()
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && selectedAlbum) closeAlbum()
  }
</script>

<svelte:window onkeydown={handleKeydown}/>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Anton Keks Photography</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <Map albums={data.albums} {hoveredAlbum} onalbumclick={openAlbum} class="col-span-full h-96 xl:col-start-4 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-2 lg:h-full"/>

    {#each data.albums as album}
      <button
        onclick={() => openAlbum(album)}
        class="group relative overflow-hidden bg-gray-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl text-left w-full"
        onmouseenter={() => hoveredAlbum = album}
        onmouseleave={() => hoveredAlbum = undefined}
      >
        <div class="aspect-square overflow-hidden">
          <img src={album.thumbnail} alt={album.title}
               class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110">
        </div>

        <div
          class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-90 transition-opacity group-hover:opacity-100">
          <h2 class="text-xl font-bold text-white leading-tight mb-1">{album.title}</h2>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-300">{album.date}</span>
          </div>
          {#if album.description}
            <p
              class="text-xs text-gray-400 mt-2 line-clamp-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {album.description}
            </p>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>

{#if selectedAlbum}
  <div
    transition:fade={{duration: 200}}
    class="fixed inset-0 z-50 flex items-center justify-center md:p-4 bg-black/70 backdrop-blur-md"
    onclick={closeAlbum}
    onkeydown={e => (e.key === 'Enter' || e.key === ' ') && closeAlbum()}
    role="button"
    tabindex="-1"
    aria-label="Close overlay"
  >
    <section
      transition:fly={{y: 20, duration: 400}}
      class="bg-white w-full max-w-4xl max-h-full md:max-h-[90vh] flex flex-col rounded shadow-2xl relative"
      onclick={e => e.stopPropagation()} onkeydown={e => e.stopPropagation()}
      role="document"
    >
      <AlbumDetail album={selectedAlbum} showClose={true} onclose={closeAlbum} />
    </section>
  </div>
{/if}
