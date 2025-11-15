<template>
    <Listbox v-model="inner" :multiple="multiple">
        <div class="relative">
            <!-- Botón -->
            <ListboxButton
                class="w-full min-h-[2rem] flex items-center bg-gray-100 rounded-md px-2 py-1 border border-transparent focus-within:border-gray-400"
            >
                <!-- Contenedor de valores -->
                <div class="flex flex-wrap flex-1 gap-1 items-center mx-1">
                    <!-- Múltiple -->
                    <template v-if="multiple && inner.length">
                        <button
                            v-for="val in inner"
                            :key="val"
                            class="inline-flex items-center gap-1 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 text-xs"
                            @click.stop="remove(val)"
                        >
                            {{ labelOf(val) }}
                        </button>
                    </template>

                    <!-- Simple -->
                    <span v-else-if="!multiple && inner !== null && inner !== undefined" class="text-sm">
                        {{ labelOf(inner) }}
                    </span>

                    <!-- Placeholder -->
                    <span class="opacity-50 text-sm" v-else>
                        {{ placeholder }}
                    </span>
                </div>

                <!-- Botón clear -->
                <button
                    v-if="clearable && hasValue"
                    type="button"
                    class="text-gray-400 hover:text-gray-600"
                    @click.stop="clear"
                >
                    <X class="w-4 h-4" />
                </button>

                <!-- Caret -->
                <span class="pointer-events-none flex items-center">
                    <ChevronDown class="w-4 h-4" />
                </span>
            </ListboxButton>

            <!-- Opciones -->
            <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-300 ring-opacity-5 focus:outline-none"
            >
                <ListboxOption
                    v-for="(opt, i) in options"
                    :key="i"
                    :value="opt[valueKey]"
                    :disabled="multiple ? inner.includes(opt[valueKey]) : false"
                    as="template"
                    v-slot="{ selected, disabled }"
                >
                    <li
                        :class="[
                            'relative select-none py-2 px-4 text-sm',
                            disabled ? 'opacity-50 bg-gray-50 ' : 'cursor-pointer',
                        ]"
                    >
                        <span>
                            {{ opt[labelKey] }}
                        </span>
                    </li>
                </ListboxOption>
            </ListboxOptions>
            <div class="absolute w-full h-0 top-[50%] left-0 opacity-0">
                <input
                    v-if="!multiple"
                    :name="name"
                    :value="inner ?? ''"
                    :required="required"
                    class="w-full h-0 border-2 border-red-500"
                    autocomplete="off"
                />
                <input
                    v-else
                    type="hidden"
                    :name="name"
                    :value="inner.length ? inner.join(',') : ''"
                    :required="required"
                    class="w-full h-0 border-2 border-red-500"
                    autocomplete="off"
                />
            </div>
        </div>
    </Listbox>

    <!-- Input oculto para validación nativa -->
</template>

<script setup>
    import { ref, watch, computed } from 'vue'
    import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
    import { X, ChevronDown } from 'lucide-vue-next'

    const props = defineProps({
        modelValue: { type: [String, Number, Array, Boolean], default: null },
        options: { type: Array, required: true },
        multiple: { type: Boolean, default: false },
        clearable: { type: Boolean, default: true },
        labelKey: { type: String, default: 'label' },
        valueKey: { type: String, default: 'value' },
        placeholder: { type: String, default: 'Selecciona...' },
        label: { type: String, default: '' },
        name: { type: String, default: 'select' }, // 👈 importante para enviar en el form
        required: { type: Boolean, default: false }, // 👈 soporte required
    })

    const emit = defineEmits(['update:modelValue', 'change', 'clear'])

    // estado interno
    const inner = ref(props.multiple ? [] : null)

    watch(
        () => props.modelValue,
        (v) => {
            if (props.multiple) {
                inner.value = Array.isArray(v) ? v : []
            } else {
                inner.value = v
            }
        },
        { immediate: true },
    )

    watch(inner, (v) => {
        emit('update:modelValue', v)
        emit('change', v)
    })

    const hasValue = computed(() => {
        if (props.multiple) return Array.isArray(inner.value) && inner.value.length > 0
        return inner.value !== null && inner.value !== undefined && inner.value !== ''
    })

    function clear() {
        inner.value = props.multiple ? [] : null
        emit('update:modelValue', inner.value)
        emit('change', inner.value)
        emit('clear')
    }

    function remove(val) {
        if (props.multiple) {
            inner.value = inner.value.filter((v) => v !== val)
        }
    }

    function labelOf(val) {
        const found = props.options.find((o) => o[props.valueKey] === val)
        return found ? found[props.labelKey] : val
    }
</script>
