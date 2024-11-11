<script
	setup
	lang="ts"
>
import { ref, reactive } from 'vue'
import { NCard, NSpace, NButton, NDataTable, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { getRoleList, deleteRole } from './api'
import EditRoleModal from './edit-role-modal.vue'
import { Role } from './types'

const loading = ref(false)
const modalRef = ref()

const modalVisible = ref(false)

const formData = {
	code: undefined,
	name: undefined,
	status: undefined
}

const model = reactive(formData)

const pagination = reactive({
	pageNumber: 1,
	pageSize: 10,
	total: 0
})

const dataList = ref<Role[]>([])

const columns = [
	{ title: '角色编码', key: 'code' },
	{ title: '角色名称', key: 'name' },
	{ title: '排序', key: 'sort' },
	{
		title: '状态',
		key: 'status',
		render: (row: Role) => row.status === 1 ? '启用' : '禁用'
	},
	{ title: '备注', key: 'remark' },
	{ title: '创建时间', key: 'createTime' },
	{
		title: '操作',
		key: 'actions',
		render: (row: Role) => {
			return h(NSpace, {}, {
				default: () => [
					h(
						NButton,
						{
							size: 'small',
							type: 'primary',
							onClick: () => handleEdit(row)
						},
						{ default: () => '编辑' }
					),
					h(
						NButton,
						{
							size: 'small',
							type: 'error',
							onClick: () => handleDelete(row)
						},
						{ default: () => '删除' }
					)
				]
			})
		}
	}
]

async function queryList() {
	loading.value = true
	try {
		const { data } = await getRoleList({
			pageNumber: pagination.pageNumber,
			pageSize: pagination.pageSize,
			...model
		})
		dataList.value = data.list
		pagination.total = data.total
	} finally {
		loading.value = false
	}
}

function handleAdd() {
	modalRef.value?.openModal('add')
}

function handleEdit(row: Role) {
	modalRef.value?.openModal('edit', row)
}

async function handleDelete(row: Role) {
	try {
		await window.$dialog.warning({
			title: '警告',
			content: '确定要删除该角色吗?',
			positiveText: '确定',
			negativeText: '取消',
			onPositiveClick: async () => {
				await deleteRole(row.id)
				$message.success('删除成功')
				queryList()
			}
		})
	} catch (error) {
		$message.error('删除失败')
	}
}

function handleResetSearch() {
	Object.assign(model, formData)
	queryList()
}

onMounted(() => {
	queryList()
})
</script>

<template><n-space vertical>
	<n-card>
		<n-form
			ref="formRef"
			:model="model"
			label-placement="left"
			inline
			:show-feedback="false"
		>
			<n-space>
				<n-form-item
					label="角色编码"
					path="code"
				>
					<n-input
						v-model:value="model.code"
						placeholder="请输入"
					/>
				</n-form-item>
				<n-form-item
					label="角色名称"
					path="name"
				>
					<n-input
						v-model:value="model.name"
						placeholder="请输入"
					/>
				</n-form-item>
				<n-form-item
					label="状态"
					path="status"
				>
					<n-select
						class="w-100px"
						v-model:value="model.status"
						:options="[
							{ label: '启用', value: 1 },
							{ label: '禁用', value: 0 }
						]"
						label-field="label"
						value-field="value"
						placeholder="请选择"
						clearable
					></n-select>
				</n-form-item>
				<n-space>
					<n-button
						type="primary"
						@click="queryList"
					>查询
					</n-button>
					<n-button @click="handleResetSearch">重置</n-button>
				</n-space>
			</n-space>
		</n-form>
	</n-card>

	<n-card>
		<n-space vertical>
			<n-button
				type="primary"
				@click="handleAdd"
			>新增角色</n-button>
			<n-data-table
				:columns="columns"
				:data="dataList"
				:loading="loading"
				:pagination="pagination"
				@update:page="queryList"
			/>
		</n-space>
	</n-card>

	<EditRoleModal
		ref="modalRef"
		v-model:visible="modalVisible"
		@success="queryList"
	/>
</n-space>
</template>
