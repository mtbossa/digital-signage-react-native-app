import { Recurrence } from "intus-database/WatermelonDB/models/Post/Post";
import {
	allRecurrentPostsQuery,
	RecurrentPostWithMedia,
} from "intus-database/WatermelonDB/models/Post/query/allRecurrentPosts";
import {
	PostWithMedia,
	showablePostsWithMediaCustomQuery,
} from "intus-database/WatermelonDB/models/Post/query/showablePostsWithMediaCustomQuery";
import { DateProvider } from "../providers/DateProvider";
import DayjsDateProvider from "../providers/implementations/DayjsDateProvider";

class CarouselService {
	private carouselMap = new Map<number, PostWithMedia>();
	private carousel: IterableIterator<PostWithMedia> = this.carouselMap.values();

	constructor(private dateProvider: DateProvider) {}

	public startCarousel = async () => {
		while (true) {
			console.log("------------------------------");
			console.log("Checking for showable posts: ", new Date());

			// All posts that fits showing logic and are not here yet
			let showablePosts = await showablePostsWithMediaCustomQuery();
			let showableRecurrentPosts = await this.showableRecurrentPostsWithMedia();

			const allShowabledPosts = [...showablePosts, ...showableRecurrentPosts];

			allShowabledPosts.forEach(post => {
				if (this.carouselMap.has(post.post_api_id)) return;
				this.carouselMap.set(post.post_api_id, post);
			});

			// All posts that are still inside current currentCarousel but should't be showing anymore
			this.deleteNotShowableAnymore(allShowabledPosts);

			console.log("this.carouselMap: ", this.carouselMap);

			console.log("Checking for showable finish");
			console.log("------------------------------");
			await new Promise(resolve => setTimeout(resolve, 10000));
		}
	};

	private async showableRecurrentPostsWithMedia(): Promise<RecurrentPostWithMedia[]> {
		const allRecurrentPosts = await allRecurrentPostsQuery();

		return allRecurrentPosts.filter(recurrentPost => this.shouldShowRecurrentPost(recurrentPost));
	}

	private shouldShowRecurrentPost(post: RecurrentPostWithMedia): boolean {
		const recurrence: Recurrence = JSON.parse(post.recurrence);
		const { day, isoweekday, month } = recurrence;

		const isRecurrenceDay = Object.entries({ day, isoweekday, month })
			.map(([unit, value]) => {
				if (!value) return true;
				if (unit === "day" || unit === "isoweekday" || unit === "month") {
					return this.dateProvider.isTodaySameUnitValue(value, unit);
				}
				return false;
			})
			.every(isTodaySameUnitValueResult => isTodaySameUnitValueResult === true);

		if (!isRecurrenceDay) return false;

		return this.checkTime(post.start_time, post.end_time);
	}

	private checkTime(startTime: string, endTime: string): boolean {
		return this.dateProvider.isNowBetweenTimes(startTime, endTime);
	}

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

	public removePostFromCarousel(postApiId: number) {
		this.carouselMap.delete(postApiId);
	}
}

export default new CarouselService(new DayjsDateProvider());
