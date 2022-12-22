import {
	PostWithMedia,
	removablePostsCustomQuery,
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
			let showablePosts = await showablePostsWithMediaCustomQuery([...this.carouselMap.keys()]);
			showablePosts.forEach(post => {
				this.carouselMap.set(post.post_api_id, post);
			});

			// All posts that are still inside current currentCarousel but should't be showing anymore
			const deletablePosts = await removablePostsCustomQuery([...this.carouselMap.keys()]);
			deletablePosts.forEach(post => {
				this.carouselMap.delete(post.post_api_id);
			});

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
			this.carousel = this.carouselMap.values();
			return this.getNextPost();
		}

		return currentValue.value;
	}
}

export default new CarouselService();
