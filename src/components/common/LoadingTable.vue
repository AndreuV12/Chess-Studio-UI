<template>
            
	<div class="flex justify-end items-center pe-3"><span class="text-sm text-gray-500 italic">Actualizando datos </span><LoaderCircle class=" w-3 h-3 animate-spin text-sorigue-primary ms-1"></LoaderCircle></div>
	<table class="w-full border-collapse">
		<tbody>
			<tr v-for="row in rows" :key="row">
				<td v-for="col in cols" :key="col" class="p-3">
					<div class="h-4 w-full rounded bg-gray-200 animate-pulse"></div>
				</td>
			</tr>
		</tbody>
	</table>
</template>


<script setup>
import { LoaderCircle } from "lucide-vue-next";

defineProps({
	rows: {
		type: Number,
		default: 5, // número de filas a mostrar
	},
	cols: {
		type: Number,
		default: 5, // número de columnas
	},
});
</script>

