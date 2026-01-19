<script lang="ts">
  import type {PageData} from './$types'
  import Map from '$lib/components/Map.svelte'

  let {data}: {data: PageData} = $props()
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Anton Keks Photography</h1>

  <Map albums={data.albums}/>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {#each data.albums as album}
      <a
        href={album.photosUrl}
        rel="noopener noreferrer"
        class="group relative overflow-hidden bg-gray-100 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
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
      </a>
    {/each}
  </div>
</div>
