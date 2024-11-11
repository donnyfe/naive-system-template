<script
	setup
	lang="ts"
>
import { ref, reactive } from 'vue'
import { NModal, NForm, NFormItem, NInput, NInputNumber, NSelect } from 'naive-ui'
import { createRole, updateRole } from './api'
import type { Role, CreateRoleParams, UpdateRoleParams } from './types'

const visible = defineModel('visible')

const emit = defineEmits(['success'])

const formRef = ref()
const loading = ref(false)
const type = ref<'add' | 'edit'>('add')
const title = computed(() => type.value === 'add' ? '新增角色' : '编辑角色')

const defaultForm = {
	id: undefined as number | undefined,
	code: '',
	name: '',
	remark: '',
	sort: 0,
	status: 1
}

const form = reactive({ ...defaultForm })

const rules = {
	code: [
		{ required: true, message: '请输入角色编码' },
		{ min: 2, max: 30, message: '长度在2-30个字符' }
	],
	name: [
		{ required: true, message: '请输入角色名称' },
		{ min: 2, max: 30, message: '长度在2-30个字符' }
	]
}

function openModal(actionType: 'add' | 'edit', data?: Role) {
	type.value = actionType
	if (actionType === 'edit' && data) {
		Object.assign(form, data)
	} else {
		Object.assign(form, defaultForm)
	}
	visible.value = true
}

async function handleSubmit() {
	await formRef.value?.validate()
	loading.value = true
	try {
		if (type.value === 'add') {
			await createRole(form as CreateRoleParams)
		} else {
			await updateRole({ ...form } as UpdateRoleParams)
		}
		$message.success(`${type.value === 'add' ? '新增' : '编辑'}成功`)
		emit('success')
		handleClose()
	} catch (error) {
		$message.error(`${type.value === 'add' ? '新增' : '编辑'}失败`)
	} finally {
		loading.value = false
	}
}

function handleClose() {
	visible.value = false
	Object.assign(form, defaultForm)
}

defineExpose({
	openModal
})
</script>

<template><n-modal
	v-model:value="visible"
	:title="title"
	preset="dialog"
	:show-icon="false"
	@close="handleClose"
>
	<n-form
		ref="formRef"
		:model="form"
		:rules="rules"
		label-placement="left"
		label-width="100"
		require-mark-placement="right-hanging"
	>
		<n-form-item
			label="角色编码"
			path="code"
		>
			<n-input
				v-model:value="form.code"
				placeholder="请输入角色编码"
			/>
		</n-form-item>
		<n-form-item
			label="角色名称"
			path="name"
		>
			<n-input
				v-model:value="form.name"
				placeholder="请输入角色名称"
			/>
		</n-form-item>
		<n-form-item
			label="排序"
			path="sort"
		>
			<n-input-number
				v-model:value="form.sort"
				placeholder="请输入排序"
			/>
		</n-form-item>
		<n-form-item
			label="状态"
			path="status"
		>
			<n-select
				v-model:value="form.status"
				:options="[
					{ label: '启用', value: 1 },
					{ label: '禁用', value: 0 }
				]"
				placeholder="请选择状态"
			/>
		</n-form-item>
		<n-form-item
			label="备注"
			path="remark"
		>
			<n-input
				v-model:value="form.remark"
				type="textarea"
				placeholder="请输入备注"
			/>
		</n-form-item>
	</n-form>
	<template #action>
		<n-space>
			<n-button @click="handleClose">取消</n-button>
			<n-button
				type="primary"
				:loading="loading"
				@click="handleSubmit"
			>
				确定
			</n-button>
		</n-space>
	</template>
</n-modal>
</template>
