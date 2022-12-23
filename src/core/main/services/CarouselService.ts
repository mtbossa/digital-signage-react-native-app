import {
	PostWithMedia,
	showablePostsWithMediaCustomQuery,
} from "intus-database/WatermelonDB/models/Post/query/showablePostsWithMediaCustomQuery";

class CarouselService {
	private carouselMap = new Map<number, PostWithMedia>();
	private carousel: IterableIterator<PostWithMedia> = this.carouselMap.values();

	public startCarousel = async () => {
		while (true) {
			console.log("------------------------------");
			console.log("Checking for showable posts: ", new Date());

			// All posts that fits showing logic and are not here yet
			let showablePosts = await showablePostsWithMediaCustomQuery();
			showablePosts.forEach(post => {
				if (this.carouselMap.has(post.post_api_id)) return;
				this.carouselMap.set(post.post_api_id, post);
			});

			// All posts that are still inside current currentCarousel but should't be showing anymore
			this.deleteNotShowableAnymore(showablePosts);

			console.log("this.carouselMap: ", this.carouselMap);

			console.log("Checking for showable finish");
			console.log("------------------------------");
			await new Promise(resolve => setTimeout(resolve, 15000));
		}
	};

	public getNextPost(): PostWithMedia | null {
		if (this.carouselMap.size === 0) return null;

		const currentValue = this.carousel.next();

		if (currentValue.done) {
			this.carousel = this.carouselMap.values(); // Resets carousel to first post, then enter here again
			return this.getNextPost();
		}

		return currentValue.value;
	}

	private deleteNotShowableAnymore(foundShowablePosts: PostWithMedia[]): void {
		this.carouselMap.forEach((post, keyAsPostApiId) => {
			const currentPostIsNotOnFoundPosts =
				foundShowablePosts.findIndex(foundPost => foundPost.post_api_id === keyAsPostApiId) === -1;

			if (currentPostIsNotOnFoundPosts) {
				this.carouselMap.delete(keyAsPostApiId);
			}
		});
	}
}

export default new CarouselService();
