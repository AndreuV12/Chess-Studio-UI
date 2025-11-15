<template>
	<div class="flex items-center gap-2">
		<!-- Modo simple: solo flechas -->
		<div v-if="props.totalItems == null || props.totalItems === undefined">
			<button
				type="button"
				class="btn btn-ghost btn-sm"
				:disabled="currentPage === 1"
				@click="$emit('update:currentPage', currentPage - 1)"
			>
				<ChevronFirst class="w-4 h-4" />
			</button>

			<button
				type="button"
				class="btn btn-ghost btn-sm"
				@click="$emit('update:currentPage', currentPage + 1)"
				:disabled="props.hasMore == false"
			>
				<ChevronLast class="w-4 h-4" />
			</button>
		</div>

		<!-- Modo completo: paginación con números -->
		<div v-else class="flex items-center justify-center gap-1 flex-wrap">
			<!-- Botó Inici -->
			<button
				class="btn btn-ghost btn-sm"
				type="button"
				:disabled="currentPage === 1"
				@click="$emit('update:currentPage', 1)"
			>
				<ChevronFirst class="w-4 h-4" />
			</button>

			<!-- Pàgines -->
			<button
				v-for="page in pagesToShow"
				:key="page.key"
				type="button"
				class="w-[2rem] h-[2rem] rounded-[1rem] btn btn-sm"
				:class="{
					'btn-soft font-semibold': page.number === currentPage,
					'btn-ghost': page.number !== currentPage,
					'pointer-events-none': page.isDots,
				}"
				@click="!page.isDots && $emit('update:currentPage', page.number)"
			>
				{{ page.label }}
			</button>

			<!-- Botó Final -->
			<button
				type="button"
				class="btn btn-ghost btn-sm"
				:disabled="currentPage === totalPages"
				@click="$emit('update:currentPage', totalPages)"
			>
				<ChevronLast class="w-4 h-4" />
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { ChevronFirst, ChevronLast } from "lucide-vue-next";

const props = defineProps({
	totalItems: { type: Number, required: false, default: null },
	hasMore: { type: Boolean, default: true },
	itemsPerPage: { type: Number, required: false, default: 50 },
	currentPage: { type: Number, required: true },
	maxPages: { type: Number, default: null },
});

const pagesCount = computed(() => {
	if (!props.totalItems) return 1;
	return Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage));
});

const totalPages = computed(() => {
	if (!props.totalItems) return 1;
	return props.maxPages ? Math.min(pagesCount.value, props.maxPages) : pagesCount.value;
});

const pagesToShow = computed(() => {
	const pages = [];
	if (!props.totalItems) return pages;

	const delta = 2;
	const { currentPage } = props;

	function add(number, label = null, isDots = false) {
		pages.push({
			number,
			label: label ?? number,
			isDots,
			key: `${label}-${Math.random()}`,
		});
	}

	add(1); // primera

	if (currentPage > delta + 2) {
		add(null, "...", true);
	}

	const start = Math.max(2, currentPage - delta);
	const end = Math.min(totalPages.value - 1, currentPage + delta);

	for (let i = start; i <= end; i++) {
		add(i);
	}

	if (currentPage < totalPages.value - delta - 1) {
		add(null, "...", true);
	}

	if (totalPages.value > 1) add(totalPages.value); // última
	return pages;
});
</script>
