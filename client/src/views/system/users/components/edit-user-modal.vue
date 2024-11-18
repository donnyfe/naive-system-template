<script
	setup
	lang="ts"
>
import type { UserData } from '../types'
import { useBoolean } from '@/hooks'
import { createUser, updateUser } from '../api'

interface Props {
	title?: string
}

type ModalType = 'add' | 'view' | 'edit'

// 定义组件属性
const props = withDefaults(defineProps<Props>(), {
	title: ''
})

// 定义事件函数
const emit = defineEmits<{
	open: []
	close: []
}>()

const { bool: modalVisible, setTrue: showModal, setFalse: hiddenModal } = useBoolean(false)
const { bool: submitLoading, setTrue: startLoading, setFalse: endLoading } = useBoolean(false)

const modalType = shallowRef<ModalType>('add')

const modalTitle = computed(() => {
	const titleMap: Record<ModalType, string> = {
		add: '添加',
		view: '查看',
		edit: '编辑'
	}
	return `${titleMap[modalType.value]}${props.title}`
})

const rules = {
	username: {
		required: true,
		message: '请输入用户名',
		trigger: 'blur'
	}
}

const formDefault: UserData = {
	username: '',
	sex: undefined,
	email: '',
	phone: ''
}
const form = ref<UserData>({ ...formDefault })

async function openModal(type: ModalType = 'add', data: any) {
	emit('open')

	modalType.value = type

	showModal()

	const handlers = {
		async add() {
			form.value = { ...formDefault }
		},
		async view() {
			if (!data) return
			form.value = { ...data }
		},
		async edit() {
			if (!data) return
			form.value = { ...data }
		}
	}
	await handlers[type]()
}

function closeModal() {
	hiddenModal()
	endLoading()
	emit('close')
}

// 导出方法
defineExpose({
	openModal
})

const formRef = ref()

async function onSubmit() {
	const handlers = {
		async add() {
			const { success } = await createUser(form.value)
			if (!success) return
			$message.success('用户创建成功')
			closeModal()
		},
		async edit() {
			const { success } = await updateUser(form.value)
			if (!success) return
			$message.success('用户更新成功')
			closeModal()
		},
		async view() {
			return true
		}
	}

	try {
		await formRef.value?.validate()
		startLoading()
		await handlers[modalType.value]()
	} catch (error) {
		console.error(error)
	} finally {
		endLoading()
	}
}

// const options = ref<RoleCode[]>([])
// async function getRoleList() {
// 	// const { data } = await queryRolesList()
// 	// options.value = data

// 	setTimeout(() => {
// 		options.value = [
// 			{ id: 1, name: '管理员', value: 'admin' },
// 			{ id: 2, name: '普通用户', value: 'user' },
// 		]
// 	}, 500)
// }
</script>

<template><n-modal
	v-model:show="modalVisible"
	:mask-closable="false"
	preset="card"
	:title="modalTitle"
	class="w-700px"
	:segmented="{
		content: true,
		action: true
	}"
>
	<n-form
		ref="formRef"
		:rules="rules"
		label-placement="left"
		:model="form"
		:label-width="100"
		:disabled="modalType === 'view'"
	>
		<n-grid
			:cols="2"
			:x-gap="18"
		>
			<n-form-item-grid-item
				:span="1"
				label="用户名"
				path="username"
			>
				<n-input v-model:value="form.username" />
			</n-form-item-grid-item>

			<n-form-item-grid-item
				:span="1"
				label="性别"
				path="sex"
			>
				<n-radio-group v-model:value="form.sex">
					<n-space>
						<n-radio value="0"> 男 </n-radio>
						<n-radio value="1"> 女 </n-radio>
					</n-space>
				</n-radio-group>
			</n-form-item-grid-item>

			<n-form-item-grid-item
				:span="1"
				label="联系方式"
				path="phone"
			>
				<n-input v-model:value="form.phone" />
			</n-form-item-grid-item>

			<n-form-item-grid-item
				:span="1"
				label="邮箱"
				path="email"
			>
				<n-input v-model:value="form.email" />
			</n-form-item-grid-item>

			<!-- <n-form-item-grid-item :span="2" label="角色" path="roles">
					<n-select v-model:value="form.roles" multiple filterable label-field="name" value-field="value"
						:options="options" />
				</n-form-item-grid-item> -->
			<n-form-item-grid-item
				:span="2"
				label="备注"
				path="remark"
			>
				<n-input
					v-model:value="form.remark"
					type="textarea"
				/>
			</n-form-item-grid-item>
		</n-grid>
	</n-form>
	<template #action>
		<n-space justify="center">
			<n-button @click="closeModal"> 取消 </n-button>
			<n-button
				type="primary"
				:loading="submitLoading"
				@click="onSubmit"
			> 提交 </n-button>
		</n-space>
	</template>
</n-modal>
</template>
