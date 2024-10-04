
// import Post from "./Post";
// import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";

import { useQuery } from "@tanstack/react-query";
// import { POSTS } from "../../utils/db/dummy";
import PostSkeleton from "../skeletons/PostSkeleton";
import Post from "./Post.jsx";
import { useEffect } from "react";

const Posts = ({feedType}) => {
	const getPostEndPoint = ()=>{
		switch (feedType) {
			case 'foryou':
				return '/api/posts/allposts'
			case 'following':
				return '/api/posts/following'
		
			default:
				return '/api/posts/allposts';
		}
	}
const postEndPoint = getPostEndPoint()
const {data,isLoading, refetch, isRefetching} = useQuery({
	queryKey:['posts'],
	queryFn:async()=>{
		try {
			const res = await fetch(postEndPoint);
			const data = await res.json();
			console.log(data)
			if(!res.ok) throw new Error(data.error);
			return data
		} catch (error) {
			throw new Error(error)
		}
	}
})
useEffect(()=>{
	refetch()
},[feedType,refetch])
	return (
		<>
			{(isLoading || isRefetching ) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching &&data?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && data && (
				<div>
					{data?.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;