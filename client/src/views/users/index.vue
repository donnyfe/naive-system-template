<script setup lang="tsx">
import type { UserData } from './types'
import CopyText from '@/components/custom/copy-text.vue'
import { SEX } from '@/constants'
import { useBoolean } from '@/hooks'
import { type DataTableColumns, type FormInst, NButton, NPopconfirm, NSpace, NTag } from 'naive-ui'
import { queryUserList, removeUser } from './api'
import EditUserModal from './components/edit-user-modal.vue'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

const formModel = {
	username: ''
}
const model = ref({ ...formModel })

function handleResetSearch() {
	model.value = { ...formModel }
}

const formRef = ref<FormInst | null>()
const modalRef = ref()

async function delteteUser(id: number) {
	const { success } = await removeUser(id)
	if (!success)
		return

	window.$message.success('删除成功')
	queryList()
}

const columns: DataTableColumns<UserData> = [
	{
		key: 'username',
		title: '姓名',
		align: 'center'
	},
	{
		key: 'sex',
		title: '性别',
		align: 'center',
		render: (row) => {
			const tagType = {
				0: 'primary',
				1: 'success'
			} as const
			if (row.sex) {
				return (
					<NTag type={tagType[row.sex]}>
						{SEX[row.sex]}
					</NTag>
				)
			}
		}
	},
	{
		key: 'phone',
		title: '联系方式',
		align: 'center',
		render: (row) => {
			return (
				<CopyText value={row.phone} />
			)
		}
	},
	{
		key: 'email',
		title: '邮箱',
		align: 'center',
		render: (row) => {
			return (
				<CopyText value={row.email} />
			)
		}
	},
	{
		key: 'actions',
		title: '操作',
		align: 'center',
		render: (row) => {
			return (
				<NSpace justify="center">
					<NButton
						size="small"
						onClick={() => modalRef.value.openModal('edit', row)}
					>
						编辑
					</NButton>
					<NPopconfirm onPositiveClick={() => delteteUser(row.id!)}>
						{{
							default: () => '确认删除',
							trigger: () => <NButton size="small" type="error">删除</NButton>
						}}
					</NPopconfirm>
				</NSpace>
			)
		}
	}
]

const total: Ref<number> = ref(0)
const pageData: Ref<UserData[]> = ref([])

async function queryList() {
	startLoading()
	const params = {
		...toRaw(model.value),
		pageNumber: 1,
		pageSize: 10
	}
	try {
		const { data } = await queryUserList(params)
		const { list, count } = data
		pageData.value = list
		total.value = count
	}
	catch (err) {
		console.error(err)
	}
	finally {
		endLoading()
	}
}

onMounted(() => {
	queryList()
})

function changePage(page: number, size: number) {
	window.$message.success(`分页器:${page},${size}`)
}
</script>

<template>
	<n-flex>
		<NSpace vertical class="flex-1">
			<n-card>
				<n-form ref="formRef" :model="model" label-placement="left" inline :show-feedback="false">
					<n-flex>
						<n-form-item label="用户名" path="username">
							<n-input v-model:value="model.username" placeholder="请输入" />
						</n-form-item>
						<n-flex class="ml-auto">
							<NButton type="primary" @click="queryList">
								<template #icon>
									<icon-park-outline-search />
								</template>
								{{ $t('common.search') }}
							</NButton>
							<NButton strong secondary @click="handleResetSearch">
								<template #icon>
									<icon-park-outline-redo />
								</template>
								{{ $t('common.reset') }}
							</NButton>
						</n-flex>
					</n-flex>
				</n-form>
			</n-card>

			<n-card class="flex-1">
				<NSpace vertical size="large">
					<div class="flex gap-4">
						<NButton type="primary" @click="modalRef.openModal('add')">
							<template #icon>
								<icon-park-outline-add-one />
							</template>
							{{ $t('users.createUser') }}
						</NButton>
					</div>
					<n-data-table :columns="columns" :data="pageData" :loading="loading" />
					<Pagination :count="total" @change="changePage" />
					<EditUserModal ref="modalRef" title="用户" @close="queryList" />
				</NSpace>
			</n-card>
		</NSpace>
	</n-flex>
</template>
