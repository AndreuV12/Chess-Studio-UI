<!-- src/components/common/ActionModal.vue -->
<template>
	<dialog ref="dialogRef" class="modal" @close="onNativeClose">
		<div class="modal-box max-w-lg p-0">
			<!-- HEADER ICON + CLOSE -->
			<div class="flex flex-col items-center">
				<div class="w-full flex justify-end">
					<button class="btn btn-sm btn-ghost" @click="close">✕</button>
				</div>

				<!-- Icon según tipo -->
				<component :is="iconComponent" class="w-18 h-18" :class="iconColor" />
			</div>

			<!-- HEADER TITLE -->
			<div class="flex items-center justify-center p-4">
				<h3 class="text-2xl text-center font-semibold">
					{{ title }}
				</h3>
			</div>

			<!-- MESSAGE -->
			<div class="p-6">
				<p class="text-lg text-center" v-html="message"></p>
			</div>

			<!-- FOOTER BUTTONS -->
			<div class="flex justify-end items-center p-6 gap-3">
				<button v-if="type !== 'info'" :disabled="loading" type="button" class="btn bg-gray-200" @click="close">
					<X class="icon-table" />
					Cancelar
				</button>

				<button :disabled="loading" class="btn text-white" :class="actionColor" @click="onConfirm">
					<span v-if="loading" class="loading loading-spinner loading-sm"></span>
					<template v-else>
						<component :is="actionIcon" class="icon-table text-white" />
						{{ actionLabel }}
					</template>
				</button>
			</div>
		</div>

		<!-- BACKDROP -->
		<form method="dialog" class="modal-backdrop">
			<button></button>
		</form>
	</dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { X, Trash, CheckCircle, AlertTriangle, Info, CircleQuestionMark } from "lucide-vue-next";

const props = defineProps({
	modelValue: { type: Boolean, default: false },
	type: { type: String, default: "delete" }, // 🔹 'delete' | 'approve' | 'warning' | 'info'
	title: { type: String, default: "¿Estás seguro?" },
	message: { type: String, default: "Se va a realizar esta acción." },
	loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "close", "confirm"]);
const dialogRef = ref(null);
const submitting = ref(false);

// 🎨 Configuración dinámica según tipo
const iconComponent = computed(() => {
	switch (props.type) {
		case "approve":
			return CheckCircle;
		case "warning":
			return AlertTriangle;
		case "info":
			return Info;
		default:
			return CircleQuestionMark;
	}
});

const iconColor = computed(() => {
	switch (props.type) {
		case "approve":
			return "text-green-500";
		case "warning":
			return "text-yellow-500";
		case "info":
			return "text-blue-500";
		default:
			return "text-red-500";
	}
});

const actionColor = computed(() => {
	switch (props.type) {
		case "approve":
			return "bg-green-500 hover:bg-green-600";
		case "warning":
			return "bg-yellow-500 hover:bg-yellow-600";
		case "info":
			return "bg-blue-500 hover:bg-blue-600";
		default:
			return "bg-red-500 hover:bg-red-600";
	}
});

const actionLabel = computed(() => {
	switch (props.type) {
		case "approve":
			return "Confirmar";
		case "warning":
			return "Continuar";
		case "info":
			return "Aceptar";
		default:
			return "Eliminar";
	}
});

const actionIcon = computed(() => {
	switch (props.type) {
		case "approve":
			return CheckCircle;
		case "warning":
			return AlertTriangle;
		case "info":
			return Info;
		default:
			return Trash;
	}
});

// 🎯 Watch para abrir/cerrar modal
watch(
	[() => props.modelValue, () => dialogRef.value],
	([open, el]) => {
		if (!el) return;
		if (open && !el.open) {
			submitting.value = false;
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

function onConfirm() {
	submitting.value = true;
	emit("confirm");
}
</script>
