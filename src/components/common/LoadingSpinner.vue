
<template>
        <div class="flex justify-center flex-col items-center p-6">
            <LoaderCircle :class="`${size} animate-spin text-sorigue-primary mb-3`"></LoaderCircle>
            <h3>Cargando datos...</h3>
		</div>

</template>
<script setup>
import { LoaderCircle } from "lucide-vue-next";
defineProps({

	size: {
		type: String,
		default: "w-16 h-16", // puedes usar w-12 h-12, w-20 h-20 etc.
	},
});
</script>