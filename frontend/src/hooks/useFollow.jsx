import { useMutation, useQueryClient } from "@tanstack/react-query"
const useFollow = ()=>{
const queryClient = useQueryClient()

const {mutate:followUnfolow,isPending} = useMutation({
	mutationFn:async(id)=>{
		try {
			const res = await fetch(`/api/users/follow/${id}`,{
				method:"POST"
			})
            const data = await res.json();
            if(!res.ok) throw new Error(data.error)
            return data
		} catch (error) {
			throw new Error(error.message)
		}
	},
    onSuccess:()=>{
        Promise.all([
            queryClient.invalidateQueries({queryKey:['suggestedUsers']}),
            queryClient.invalidateQueries({queryKey:['authUser']})
        ])
    }
})
return {followUnfolow,isPending}
}

export default useFollow