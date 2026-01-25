<script lang="ts">
  import type {PageData} from './$types'
  import Map from '$lib/components/Map.svelte'
  import type {Album} from '$lib/album_loader'
  import snarkdown from 'snarkdown'
  import {fade, fly} from 'svelte/transition'

  let {data}: {data: PageData} = $props()
  let hoveredAlbum: Album | undefined = $state()
  let selectedAlbum: Album | null = $state(null)

  function closeAlbum() {
    selectedAlbum = null
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeAlbum()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Anton Keks Photography</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    <Map albums={data.albums} {hoveredAlbum} class="col-span-full h-96 xl:col-start-4 lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-2 lg:h-full"/>

    {#each data.albums as album}
      <button
        onclick={() => selectedAlbum = album}
        class="group relative overflow-hidden bg-gray-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl text-left w-full cursor-pointer"
        onmouseenter={() => hoveredAlbum = album}
        onmouseleave={() => hoveredAlbum = undefined}
      >
        <div class="aspect-square overflow-hidden">
          <img
            src={album.thumbnail}
            alt={album.title}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
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
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md cursor-default"
    onclick={closeAlbum}
    onkeydown={e => (e.key === 'Enter' || e.key === ' ') && closeAlbum()}
    role="button"
    tabindex="-1"
    aria-label="Close overlay"
  >
    <section
      transition:fly={{y: 20, duration: 400}}
      class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative cursor-auto text-left"
      onclick={e => e.stopPropagation()}
      onkeydown={e => e.stopPropagation()}
      role="document"
    >
      <button
        onclick={closeAlbum}
        class="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2 z-10 bg-white/90 rounded-full shadow-sm hover:scale-110 active:scale-95"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="p-6 md:p-12">
        <div class="aspect-video mb-10 overflow-hidden rounded-2xl shadow-xl">
          <img src={selectedAlbum.thumbnail} alt={selectedAlbum.title} class="w-full h-full object-cover" />
        </div>

        <article class="prose prose-slate lg:prose-xl max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600">
          {@html snarkdown(selectedAlbum.fullDescription)}
        </article>

        <div class="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-gray-100 pt-10">
          <div class="text-gray-400 font-medium">
            {selectedAlbum.date}
          </div>
          <a
            href={selectedAlbum.photosUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105 shadow-xl hover:shadow-blue-200 active:scale-95 group"
          >
            <span>View Full Photo Album</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  </div>
{/if}
