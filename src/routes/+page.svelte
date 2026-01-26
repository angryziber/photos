<script lang="ts">
  import {onMount} from 'svelte'
  import type {PageData} from './$types'
  import Map from '$lib/components/Map.svelte'
  import type {Album} from '$lib/album_loader'
  import snarkdown from 'snarkdown'
  import {fade, fly} from 'svelte/transition'
  import RightArrowIcon from '$lib/components/RightArrowIcon.svelte'
  import CloseIcon from '$lib/components/CloseIcon.svelte'
  import ThumbIcon from '$lib/components/ThumbIcon.svelte'

  let {data}: {data: PageData} = $props()
  let hoveredAlbum: Album | undefined = $state()
  let hash = $state('')

  onMount(() => {
    hash = location.hash
    addEventListener('hashchange', () => hash = location.hash)
  })

  let selectedAlbum = $derived(data.albums.find(a => a.id === hash.slice(1)))

  function openAlbum(album: Album) {
    location.hash = album.id
  }

  function closeAlbum() {
    location.hash = ''
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeAlbum()
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
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-90 transition-opacity group-hover:opacity-100">
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
      <div class="sticky top-0 bg-white/95 backdrop-blur-md z-20 p-6 md:px-10 border-b border-gray-100 flex items-center justify-between gap-4 rounded-t-3xl">
        <h2 class="text-2xl font-bold text-gray-900 leading-tight">{selectedAlbum.title}</h2>
        <div class="flex items-center gap-2 md:gap-4">
          <a href={selectedAlbum.photosUrl} rel="noopener noreferrer"
            class="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 group/topbtn whitespace-nowrap shadow-sm">
            <span class="hidden sm:inline">View Photos</span>
            <span class="sm:hidden text-sm">Photos</span>
            <RightArrowIcon class="group-hover/topbtn:translate-x-1"/>
          </a>
          <button onclick={closeAlbum} title="Close"
            class="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-full shadow-sm hover:scale-110 active:scale-95">
            <CloseIcon/>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-10">
        <a href={selectedAlbum.photosUrl} rel="noopener noreferrer"
          class="block group/thumb aspect-video mb-10 overflow-hidden rounded shadow-xl relative">
          <img src={selectedAlbum.thumbnail} alt={selectedAlbum.title} class="w-full h-full object-cover transition-transform duration-700 group-hover/thumb:scale-105">
          <div class="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
            <div class="bg-white/90 p-4 rounded-full shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-all scale-75 group-hover/thumb:scale-100">
              <ThumbIcon/>
            </div>
          </div>
        </a>

        <article class="prose prose-slate lg:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
          {@html snarkdown(selectedAlbum.fullDescription)}
        </article>

        <div class="mt-16 flex items-center justify-between gap-8 border-t border-gray-100 pt-10">
          <div class="text-gray-400 font-medium italic">
            {selectedAlbum.date}
          </div>
        </div>
      </div>
    </section>
  </div>
{/if}
