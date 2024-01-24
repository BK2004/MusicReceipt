export default function GenerateSkeleton() {
	return (<div className="w-full max-w-4xl flex flex-col justify-start gap-4">
		{Array(10).fill(2).map((n, k) => {
			return (<div key={k} className="w-full bg-gray-700 opacity-70 rounded-md py-12">
				
			</div>);
		})}
	</div>)
}