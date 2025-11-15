<template>
    <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-2xl font-semibold">Input</h1>
            <p class="my-1">Customizable Input component</p>
        </div>
        <div class="border-1 border-gray-400 shadow-lg rounded-lg p-4 flex flex-col items-start gap-2">
            <span>Basic usage</span>

            <Input v-model="value1" placeholder="Type to me..."></Input>

            <span>v-model: {{ value1 }}</span>
        </div>
        <div class="border-1 border-gray-400 shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <span>Clearable</span>
            <div class="flex gap-4">
                <Input placeholder="Clearable" clearable> </Input>
            </div>
        </div>
        <div class="border-1 border-gray-400 shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <span>Disabled</span>
            <div class="flex gap-4">
                <Input disabled></Input>
                <Input v-model="disabledValue" disabled> </Input>
            </div>
        </div>
        <div class="border-1 border-gray-400 shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <span>Slots</span>
            <div class="flex gap-4">
                <Input placeholder="icon-start" clearable>
                    <template #icon-start>
                        <Search class="w-4 h-4"></Search>
                    </template>
                </Input>

                <Input placeholder="icon-end" clearable>
                    <template #icon-end>
                        <Search class="w-4 h-4"></Search>
                    </template>
                </Input>

                <Input placeholder="both start and end" clearable>
                    <template #icon-start>
                        <Search class="w-4 h-4"></Search>
                    </template>
                    <template #icon-end>
                        <Calendar class="w-4 h-4"></Calendar>
                    </template>
                </Input>
            </div>
        </div>
        <div class="border-1 border-gray-400 shadow-lg rounded-lg p-4 flex flex-col gap-2">
            <span>Flexbox</span>
            <div class="flex bg-blue-50 p-2 rounded-lg">
                <Input placeholder="flex flex-1" class="flex-1"></Input>
            </div>
            <div class="flex bg-blue-50 p-2 rounded-lg gap-4">
                <Input placeholder="flex-1" class="flex-1"></Input>
                <Input placeholder="flex-1" class="flex-1"></Input>
            </div>
            <div class="flex bg-blue-50 p-2 rounded-lg gap-4 overflow-auto">
                <Input placeholder="flex-1" class="flex-1"></Input>
                <Input placeholder="flex-2" class="flex-2"></Input>
                <Input placeholder="flex-1" class="flex-1"></Input>
            </div>
            <div class="flex bg-blue-50 p-2 rounded-lg gap-4">
                <Input placeholder="flex-1" class="flex-1"></Input>
                <Input placeholder="w-auto"></Input>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Input from '@/components/common/Input.vue'
    import { Search, Calendar } from 'lucide-vue-next'
    import { ref } from 'vue'

    const value1 = ref('')
    const disabledValue = ref('Disabled with value')
</script>
