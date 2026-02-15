import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		const [year, month] = dateStr.split("-");
		return new Date(year, month - 1).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short"
		});
	};

	return (
		<div className="max-w-4xl mx-auto bg-white text-gray-800">
			{/* Header */}
			<header className="p-4 sm:p-6 md:p-8 text-white" style={{ backgroundColor: accentColor }}>
				<h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-2 sm:mb-3">
					{data.personal_info?.full_name || "Your Name"}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ">
					{data.personal_info?.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4" />
							<span>{data.personal_info.email}</span>
						</div>
					)}
					{data.personal_info?.phone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4" />
							<span>{data.personal_info.phone}</span>
						</div>
					)}
					{data.personal_info?.location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4" />
							<span>{data.personal_info.location}</span>
						</div>
					)}
					{data.personal_info?.linkedin && (
						<a target="_blank" href={data.personal_info?.linkedin} className="flex items-center gap-2">
							<Linkedin className="size-4" />
							<span className="break-all text-xs">{data.personal_info.linkedin.split("https://www.")[1] ? data.personal_info.linkedin.split("https://www.")[1] : data.personal_info.linkedin}</span>
						</a>
					)}
					{data.personal_info?.website && (
						<a target="_blank" href={data.personal_info?.website} className="flex items-center gap-2">
							<Globe className="size-4" />
							<span className="break-all text-xs">{data.personal_info.website.split("https://")[1] ? data.personal_info.website.split("https://")[1] : data.personal_info.website}</span>
						</a>
					)}
				</div>
			</header>

				<div className="p-4 sm:p-6 md:p-8">
					{/* Professional Summary */}
					{data.professional_summary && (
						<section className="mb-6 sm:mb-8">
							<h2 className="text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 pb-2 border-b border-gray-200">
							Professional Summary
						</h2>
						<p className="text-gray-700 ">{data.professional_summary}</p>
					</section>
				)}

				{/* Experience */}
				{data.experience && data.experience.length > 0 && (
						<section className="mb-6 sm:mb-8">
							<h2 className="text-lg sm:text-xl md:text-2xl font-light mb-4 sm:mb-6 pb-2 border-b border-gray-200">
								Experience
							</h2>

							<div className="space-y-4 sm:space-y-6">
								{data.experience.map((exp, index) => (
									<div key={index} className="relative pl-4 sm:pl-6 border-l border-gray-200">

										<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
											<div>
												<h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">{exp.position}</h3>
												<p className="text-sm sm:text-base font-medium" style={{ color: accentColor }}>{exp.company}</p>
											</div>
											<div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded mt-2 sm:mt-0 w-fit">
											{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
										</div>
									</div>
									{exp.description && (
										<div className="text-gray-700 leading-relaxed mt-3 whitespace-pre-line">
											{exp.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Projects */}
				{data.project && data.project.length > 0 && (
					<section className="mb-8">
						<h2 className="text-2xl font-light mb-4 pb-2 border-b border-gray-200">
							Projects
						</h2>

						<div className="space-y-4 sm:space-y-6">
							{data.project.map((p, index) => (
								<div key={index} className="relative pl-4 sm:pl-6 border-l border-gray-200" style={{borderLeftColor: accentColor}}>


									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-base sm:text-lg font-medium text-gray-900">{p.name}</h3>
										</div>
									</div>
									{p.description && (
										<div className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-2 sm:mt-3">
											{p.description}
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
					{/* Education */}
					{data.education && data.education.length > 0 && (
						<section>
							<h2 className="text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 pb-2 border-b border-gray-200">
								Education
							</h2>

							<div className="space-y-3 sm:space-y-4">
								{data.education.map((edu, index) => (
									<div key={index}>
										<h3 className="text-sm sm:text-base font-semibold text-gray-900">
											{edu.degree} {edu.field && `in ${edu.field}`}
										</h3>
										<p className="text-xs sm:text-sm" style={{ color: accentColor }}>{edu.institution}</p>
										<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-600 gap-1">
											<span>{formatDate(edu.graduation_date)}</span>
											{edu.gpa && <span>GPA: {edu.gpa}</span>}
										</div>
									</div>
								))}
							</div>
						</section>
					)}

					{/* Skills */}
					{data.skills && data.skills.length > 0 && (
						<section>
							<h2 className="text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 pb-2 border-b border-gray-200">
								Skills
							</h2>

							<div className="flex flex-wrap gap-1 sm:gap-2">
								{data.skills.map((skill, index) => (
									<span
										key={index}
										className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-white rounded-full"
										style={{ backgroundColor: accentColor }}
									>
										{skill}
									</span>
								))}
							</div>
						</section>
					)}
				</div>
			</div>
		</div>
	);
}

export default ModernTemplate;