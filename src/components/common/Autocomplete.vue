<template>
	<div class="relative w-0 min-w-[120px]">
		<input
            class="absolute w-full h-[1px] top-[100%] left-0 opacity-0" 
            v-model="props.modelValue" 
            :name="name"
			:required="required"
            :autocomplete="false"
        >

        </input>
		<input
			class=" pe-6 w-full min-h-[2rem] flex items-center bg-gray-100 rounded-md px-2 py-1 border border-transparent focus-within:border-gray-400 focus-within:outline-none text-sm truncate"
			:class="{ 'pe-10': clearable}"
            v-model="inputValue"
			:placeholder="placeholder"
			
			@input="onInput"
			@focus="open = true"
			@blur="closeDropdown"
		/>
        <button
            v-if="optionSelected && props.clearable"
            type="button"
            class="text-gray-400 hover:text-gray-600 absolute top-0 right-4 p-2"
            @click.stop="optionSelected = null"
        >
            <X class="w-4 h-4" />
        </button>

        <!-- Caret -->
        <span class="pointer-events-none flex items-center absolute top-0 right-0 p-2">
            <ChevronDown class="w-4 h-4" />
        </span>

		<!-- Dropdown -->
		<ul
			v-if="open && filteredOptions.length"
			class="absolute left-0 right-0 mt-1 py-1 bg-white border-1 border-gray-300 rounded-lg shadow-sm z-10 max-h-100 overflow-auto"
		>
			<li
				v-for="(option, idx) in filteredOptions"
				:key="idx"
				@click.stop="selectOption(option)"
				class="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
			>
				{{ option.name }}
			</li>
		</ul>
        
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { X, ChevronDown } from "lucide-vue-next";
const props = defineProps({
	modelValue: String || Number || Bool || Array,
	options: { type: Array, required: true },
	placeholder: String,
	required: Boolean,
    clearable: { type: Boolean, default: true },

	name: String,
	labelKey: { type: String, default: "label" },
	valueKey: { type: String, default: "value" },
});

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);

const optionSelected = ref(null);
const filter = ref("");

const filteredOptions = computed(() => {
	let options = props.options;
	if (filter.value) {
		options = options.filter((opt) => getLabel(opt).toLowerCase().includes(filter.value.toLowerCase()));
	}
	return options;
});

function getLabel(opt) {
	if (!opt) return "";
	return typeof opt === "string" ? opt : opt[props.labelKey] || "";
}

function getValue(opt) {
    if (!opt) return null;
	return typeof opt === "string" ? opt : opt[props.valueKey];
}

function selectOption(option) {
    open.value = false;
    filter.value = null
    optionSelected.value = props.options.find((opt) => opt[props.valueKey] === option[props.valueKey]);	
}

function closeDropdown() {
	setTimeout(() => {
        open.value = false
        if (!optionSelected.value) {
            filter.value = "";
        }
    }, 200);
}

const inputValue = computed({
    get() {
        if (optionSelected.value) {
            return getLabel(optionSelected.value);
        }
        else {
            return filter.value
        }
    },
    set(newVal) {
        optionSelected.value = null
        filter.value = newVal
        return newVal
    },
})

watch(
    () => filter.value,
    (val) => {
        if (val === "") {
            open.value = false
        }
        selectOption.value = null
    })

watch(
	() => optionSelected.value,
	(val) => {        
        if (!val ){
            if (props.modelValue){
                emit("update:modelValue", null);
            }
            return
        }
        
        emit("update:modelValue", getValue(val));  
	}
);

watch(
	() => props.modelValue,
	(val) => {
        const matched = props.options.find((opt) => opt[props.valueKey] === val);
        if (matched) {
            optionSelected.value = matched
        }
        else {
            optionSelected.value = null
        }
	},
	{ immediate: true }
);

watch(
  [() => props.modelValue, () => props.options],
  ([val, options]) => {
    const matched = options.find((opt) => opt[props.valueKey] === val);
    if (matched) {
      optionSelected.value = matched;
    }
  },
  { immediate: true }
);

</script>
