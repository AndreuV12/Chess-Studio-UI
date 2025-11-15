<template>
	<dialog ref="dialogRef" class="modal" @close="onNativeClose">
		<div class="modal-box max-w-lg p-0">
			<div class="flex flex-col items-center">
				<div class="w-full flex justify-end">
					<button class="btn btn-sm btn-ghost" @click="close">✕</button>
				</div>
				<CircleX class="w-18 h-18 text-red-500"></CircleX>
			</div>
			<!-- Header -->
			<div class="flex items-center justify-center p-4">
				<h3 class="text-2xl">
					{{ title }}
				</h3>
			</div>

			<!-- Content -->
			<div class="p-4">
				<p class="text-lg text-center">{{ message }}</p>
			</div>

			<!-- Footer -->
			<div class="w-full flex p-6">
				<button class="btn flex-1 bg-red-500 text-white" @click="close">Cerrar</button>
			</div>
		</div>

		<!-- Backdrop -->
		<form method="dialog" class="modal-backdrop">
			<button></button>
		</form>
	</dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { CircleX } from "lucide-vue-next";

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	title: { type: String, default: "Error" },
	message: { type: String, default: "Ha ocurrido un error inesperado." },
});

const emit = defineEmits(["update:modelValue", "close"]);

const dialogRef = ref(null);

watch(
	[() => props.modelValue, () => dialogRef.value],
	([open, el]) => {
		if (!el) return;

		if (open && !el.open) {
			el.showModal();
		} else if (!open && el.open) {
			el.close();
		}
	},
	{ immediate: true }
);

function close() {
	emit("update:modelValue", false);
}

function onNativeClose() {
	if (props.modelValue) emit("update:modelValue", false);
	emit("close");
}
</script>
