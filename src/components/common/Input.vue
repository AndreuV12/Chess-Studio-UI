<template>
	<div
		class="w-0 min-w-[120px] h-[2rem] flex items-center bg-gray-100 rounded-md py-1 border border-transparent focus-within:border-gray-400 px-2"
	>
		<slot name="icon"></slot>

		<input
			ref="inputEl"
			:type="props.typeInput"
			:placeholder="props.placeholder ?? ''"
			:value="value"
			:disabled="props.disabled"
			:required="props.required ?? false"
			:maxlength="props.maxlength"
			:max="props.max"
			@input="onInput"
			@keydown.enter.prevent="onEnter"
			@focus="$emit('focus')"
			@blur="$emit('blur')"
			class="text-sm bg-transparent outline-none w-full ms-1"
		/>

		<button
			type="button"
			v-if="props.clearable && value"
			class="text-gray-400 hover:text-gray-600"
			@click.stop="onClear"
		>
			<X class="w-4 h-4" />
		</button>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
	modelValue: String|Number, // ✅ v-model
	typeInput: { type: String, default: "text" },
	placeholder: String,
	disabled: Boolean,
	clearable: Boolean,
	required: Boolean,
	max: { type: Number, default: null },
	maxlength: { type: Number, default: 30 },
	debounce: { type: Number, default: 0 }, // ⏱ tiempo en ms
});

const emit = defineEmits(["update:modelValue", "submit", "clear", "focus", "blur"]);

const value = ref(props.modelValue ?? "");
let debounceTimer = null;

// 🔁 mantener sincronizado el valor externo ↔ interno
watch(
	() => props.modelValue,
	(v) => {
		if (v !== value.value) value.value = v ?? "";
	}
);

const inputEl = ref(null);

function onInput(e) {
	const v = e.target.value;
	value.value = v;

	// Si no hay debounce, emitir al momento
	if (!props.debounce || props.debounce <= 0) {
		emit("update:modelValue", v);
		return;
	}

	// Si hay debounce, limpiar y esperar
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		emit("update:modelValue", v);
	}, props.debounce);
}

function onEnter() {
	// forzar flush inmediato al presionar enter
	clearTimeout(debounceTimer);
	emit("update:modelValue", value.value);
	emit("submit", value.value);
}

function onClear() {
	clearTimeout(debounceTimer);
	value.value = "";
	emit("update:modelValue", "");
	emit("clear");
	inputEl.value?.focus();
}
</script>
