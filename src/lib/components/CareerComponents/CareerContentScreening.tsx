"use client"

import styles from "@/lib/styles/components/careerForm.module.scss";

export default function CareerContentScreening() {
    return (
        <div className={styles.mainContentContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.careerCard}>
                    <div className={styles.careerCardHeader}>
                        <span className={styles.careerCardTitle}>CV Review & Pre-screening</span>
                    </div>
                    <div className={styles.careerCardContent}>
                        {/* Content will be added here */}
                    </div>
                </div>
            </div>

            <div className={styles.rightContainer}>
                <div className="layered-card-middle">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="la la-cog" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                        </div>
                        <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>Settings</span>
                    </div>
                    <div className="layered-card-content">
                        {/* Settings content will be added here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

