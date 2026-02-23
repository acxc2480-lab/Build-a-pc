// Compatibility Engine - Checks hardware compatibility between selected components

/**
 * Check compatibility between all selected components
 * Returns: { score, issues, warnings, strengths }
 */
export function checkCompatibility(selectedComponents) {
    const issues = [];    // Critical incompatibilities (red)
    const warnings = [];  // Performance concerns (yellow)
    const strengths = []; // Good combinations (green)

    const { cpu, vga, mainboard, ram, psu, cooling, case: pcCase, ssd, hdd } = selectedComponents;

    // Count selected components
    const selectedCount = Object.values(selectedComponents).filter(Boolean).length;
    if (selectedCount < 2) {
        return { score: 0, issues: [], warnings: [], strengths: [], selectedCount };
    }

    // === CPU + Mainboard Socket Check ===
    if (cpu && mainboard) {
        if (cpu.socket !== mainboard.socket) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Socket không tương thích',
                detail: `CPU ${cpu.name} sử dụng socket ${cpu.socket}, nhưng mainboard ${mainboard.name} sử dụng socket ${mainboard.socket}. Hai linh kiện này KHÔNG thể hoạt động cùng nhau.`,
                components: ['cpu', 'mainboard'],
            });
        } else {
            strengths.push({
                icon: '✅',
                title: 'Socket tương thích',
                detail: `CPU và Mainboard đều sử dụng socket ${cpu.socket}.`,
            });
        }
    }

    // === CPU + Mainboard RAM Type Check ===
    if (cpu && mainboard) {
        const cpuSupportsRamType = cpu.ramType.includes(mainboard.ramType);
        if (!cpuSupportsRamType) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'RAM Type không tương thích',
                detail: `CPU ${cpu.name} hỗ trợ ${cpu.ramType.join(', ')}, nhưng mainboard ${mainboard.name} sử dụng ${mainboard.ramType}.`,
                components: ['cpu', 'mainboard'],
            });
        }
    }

    // === RAM + Mainboard Compatibility ===
    if (ram && mainboard) {
        if (ram.type !== mainboard.ramType) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'RAM không tương thích với Mainboard',
                detail: `RAM ${ram.name} là ${ram.type}, nhưng mainboard ${mainboard.name} chỉ hỗ trợ ${mainboard.ramType}.`,
                components: ['ram', 'mainboard'],
            });
        } else {
            strengths.push({
                icon: '✅',
                title: 'RAM tương thích',
                detail: `RAM ${ram.type} tương thích với mainboard.`,
            });
        }

        // Check RAM capacity vs mainboard max
        if (ram.capacity > mainboard.maxRam) {
            warnings.push({
                type: 'warning',
                icon: '⚠️',
                title: 'RAM vượt quá giới hạn',
                detail: `RAM ${ram.capacity}GB vượt quá giới hạn ${mainboard.maxRam}GB của mainboard ${mainboard.name}.`,
                components: ['ram', 'mainboard'],
            });
        }

        // Check RAM sticks vs mainboard slots
        if (ram.sticks > mainboard.ramSlots) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Không đủ slot RAM',
                detail: `RAM kit ${ram.sticks} thanh nhưng mainboard chỉ có ${mainboard.ramSlots} slot.`,
                components: ['ram', 'mainboard'],
            });
        }
    }

    // === CPU + RAM Type Check ===
    if (cpu && ram) {
        if (!cpu.ramType.includes(ram.type)) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'CPU không hỗ trợ loại RAM này',
                detail: `CPU ${cpu.name} hỗ trợ ${cpu.ramType.join(', ')}, nhưng RAM là ${ram.type}.`,
                components: ['cpu', 'ram'],
            });
        }
    }

    // === PSU Wattage Check ===
    if (psu) {
        let estimatedTDP = 0;
        if (cpu) estimatedTDP += cpu.tdp;
        if (vga) estimatedTDP += vga.tdp;
        estimatedTDP += 50; // Other components

        const headroom = psu.wattage - estimatedTDP;
        const headroomPercent = (headroom / psu.wattage) * 100;

        if (headroom < 0) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'PSU không đủ công suất',
                detail: `Hệ thống ước tính cần ~${estimatedTDP}W, nhưng PSU chỉ có ${psu.wattage}W. Thiếu ${Math.abs(headroom)}W!`,
                components: ['psu'],
            });
        } else if (headroomPercent < 20) {
            warnings.push({
                type: 'warning',
                icon: '⚠️',
                title: 'PSU gần đầy tải',
                detail: `PSU ${psu.wattage}W với ước tính ${estimatedTDP}W (~${Math.round((estimatedTDP / psu.wattage) * 100)}% tải). Nên chọn PSU có headroom 20-30%.`,
                components: ['psu'],
            });
        } else {
            strengths.push({
                icon: '✅',
                title: 'PSU đủ công suất',
                detail: `PSU ${psu.wattage}W đủ cho hệ thống ~${estimatedTDP}W (${Math.round(headroomPercent)}% dư).`,
            });
        }

        // GPU recommended PSU check
        if (vga && psu.wattage < vga.recommendedPSU) {
            warnings.push({
                type: 'warning',
                icon: '⚠️',
                title: 'PSU dưới mức khuyến nghị GPU',
                detail: `${vga.name} khuyến nghị PSU tối thiểu ${vga.recommendedPSU}W, nhưng PSU chỉ có ${psu.wattage}W.`,
                components: ['psu', 'vga'],
            });
        }
    }

    // === Cooling + CPU TDP Check ===
    if (cooling && cpu) {
        if (cooling.tdpSupport < cpu.tdp) {
            warnings.push({
                type: 'warning',
                icon: '⚠️',
                title: 'Tản nhiệt có thể không đủ',
                detail: `Tản nhiệt ${cooling.name} hỗ trợ TDP ${cooling.tdpSupport}W, CPU cần ${cpu.tdp}W. Có thể throttle khi full load.`,
                components: ['cooling', 'cpu'],
            });
        } else {
            strengths.push({
                icon: '✅',
                title: 'Tản nhiệt phù hợp',
                detail: `${cooling.name} (${cooling.tdpSupport}W) đủ mát cho ${cpu.name} (${cpu.tdp}W TDP).`,
            });
        }

        // Socket compatibility
        if (cooling.sockets && !cooling.sockets.includes(cpu.socket)) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Tản nhiệt không hỗ trợ socket',
                detail: `${cooling.name} không hỗ trợ socket ${cpu.socket} của CPU.`,
                components: ['cooling', 'cpu'],
            });
        }
    }

    // === Case + Mainboard Form Factor ===
    if (pcCase && mainboard) {
        if (!pcCase.formFactor.includes(mainboard.formFactor)) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Case không vừa Mainboard',
                detail: `Case ${pcCase.name} hỗ trợ ${pcCase.formFactor.join(', ')}, nhưng mainboard ${mainboard.name} là ${mainboard.formFactor}.`,
                components: ['case', 'mainboard'],
            });
        } else {
            strengths.push({
                icon: '✅',
                title: 'Case tương thích Mainboard',
                detail: `Case hỗ trợ form factor ${mainboard.formFactor} của mainboard.`,
            });
        }
    }

    // === Case + GPU Length ===
    if (pcCase && vga) {
        if (vga.length > pcCase.maxGPULength) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'GPU quá dài cho case',
                detail: `${vga.name} dài ${vga.length}mm, case chỉ chứa được tối đa ${pcCase.maxGPULength}mm.`,
                components: ['case', 'vga'],
            });
        } else {
            const clearance = pcCase.maxGPULength - vga.length;
            if (clearance < 20) {
                warnings.push({
                    type: 'warning',
                    icon: '⚠️',
                    title: 'GPU vừa khít case',
                    detail: `GPU dài ${vga.length}mm, case max ${pcCase.maxGPULength}mm. Chỉ còn ${clearance}mm dư.`,
                    components: ['case', 'vga'],
                });
            }
        }
    }

    // === Case + Cooler Height ===
    if (pcCase && cooling && cooling.height) {
        if (cooling.height > pcCase.maxCoolerHeight) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Tản nhiệt quá cao cho case',
                detail: `${cooling.name} cao ${cooling.height}mm, case chỉ chứa được tối đa ${pcCase.maxCoolerHeight}mm.`,
                components: ['case', 'cooling'],
            });
        }
    }

    // === Case + AIO Radiator ===
    if (pcCase && cooling && cooling.radiatorSize) {
        if (!pcCase.radiatorSupport.includes(cooling.radiatorSize)) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Case không hỗ trợ radiator',
                detail: `Case ${pcCase.name} hỗ trợ radiator ${pcCase.radiatorSupport.join('/')}mm, nhưng ${cooling.name} là ${cooling.radiatorSize}mm.`,
                components: ['case', 'cooling'],
            });
        }
    }

    // === SSD + Mainboard M.2 Slots ===
    if (ssd && mainboard && ssd.type === 'NVMe M.2') {
        if (mainboard.m2Slots === 0) {
            issues.push({
                type: 'critical',
                icon: '🔴',
                title: 'Mainboard không có slot M.2',
                detail: `Mainboard ${mainboard.name} không có slot M.2 cho SSD NVMe.`,
                components: ['ssd', 'mainboard'],
            });
        } else {
            strengths.push({
                icon: '✅',
                title: 'SSD M.2 tương thích',
                detail: `Mainboard có ${mainboard.m2Slots} slot M.2.`,
            });
        }
    }

    // === Performance Balance Warnings ===
    if (cpu && vga) {
        const tierOrder = ['budget', 'mid', 'mid-high', 'high', 'ultra'];
        const cpuTierIdx = tierOrder.indexOf(cpu.tier);
        const vgaTierIdx = tierOrder.indexOf(vga.tier);
        const tierDiff = Math.abs(cpuTierIdx - vgaTierIdx);

        if (tierDiff >= 2) {
            if (cpuTierIdx > vgaTierIdx) {
                warnings.push({
                    type: 'warning',
                    icon: '⚠️',
                    title: 'GPU yếu so với CPU (Bottleneck)',
                    detail: `CPU tier "${cpu.tier}" mạnh hơn nhiều so với GPU tier "${vga.tier}". GPU có thể trở thành bottleneck trong game.`,
                    components: ['cpu', 'vga'],
                });
            } else {
                warnings.push({
                    type: 'warning',
                    icon: '⚠️',
                    title: 'CPU yếu so với GPU (Bottleneck)',
                    detail: `GPU tier "${vga.tier}" mạnh hơn nhiều so với CPU tier "${cpu.tier}". CPU có thể trở thành bottleneck.`,
                    components: ['cpu', 'vga'],
                });
            }
        } else if (tierDiff <= 1) {
            strengths.push({
                icon: '✅',
                title: 'Cân bằng CPU/GPU tốt',
                detail: `CPU và GPU ở tier tương đương, hiệu năng cân bằng.`,
            });
        }
    }

    // Calculate score
    const score = calculateScore(issues, warnings, strengths, selectedCount);

    return { score, issues, warnings, strengths, selectedCount };
}

function calculateScore(issues, warnings, strengths, selectedCount) {
    if (selectedCount < 2) return 0;

    let score = 100;

    // Critical issues reduce score heavily
    score -= issues.length * 25;

    // Warnings reduce score moderately
    score -= warnings.length * 8;

    // Strengths add small bonus
    score += strengths.length * 3;

    // Bonus for more components selected
    score += Math.min(selectedCount * 2, 18);

    // Clamp
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get smart suggestions based on selected components
 */
export function getSmartSuggestions(selectedComponents, allComponents) {
    const suggestions = [];
    const { cpu, vga, mainboard, ram, psu, cooling } = selectedComponents;

    // Suggest mainboard based on CPU
    if (cpu && !mainboard) {
        const compatibleBoards = allComponents.mainboard.filter(
            mb => mb.socket === cpu.socket && cpu.ramType.includes(mb.ramType)
        );
        if (compatibleBoards.length > 0) {
            suggestions.push({
                category: 'mainboard',
                icon: '🔧',
                title: 'Mainboard gợi ý',
                detail: `Dựa trên CPU ${cpu.name} (${cpu.socket})`,
                items: compatibleBoards.slice(0, 3),
            });
        }
    }

    // Suggest RAM based on mainboard
    if (mainboard && !ram) {
        const compatibleRam = allComponents.ram.filter(r => r.type === mainboard.ramType);
        if (compatibleRam.length > 0) {
            suggestions.push({
                category: 'ram',
                icon: '💾',
                title: 'RAM gợi ý',
                detail: `Mainboard hỗ trợ ${mainboard.ramType}`,
                items: compatibleRam.slice(0, 3),
            });
        }
    }

    // Suggest PSU based on CPU + GPU
    if ((cpu || vga) && !psu) {
        let estimatedTDP = 50;
        if (cpu) estimatedTDP += cpu.tdp;
        if (vga) estimatedTDP += vga.tdp;
        const recommendedWattage = Math.ceil(estimatedTDP * 1.3 / 50) * 50; // 30% headroom, round up to 50

        const suitablePSUs = allComponents.psu.filter(p => p.wattage >= recommendedWattage);
        if (suitablePSUs.length > 0) {
            suggestions.push({
                category: 'psu',
                icon: '⚡',
                title: 'PSU gợi ý',
                detail: `Hệ thống cần ~${estimatedTDP}W, khuyến nghị ≥${recommendedWattage}W`,
                items: suitablePSUs.slice(0, 3),
            });
        }
    }

    // Suggest cooling based on CPU
    if (cpu && !cooling) {
        const suitableCoolers = allComponents.cooling.filter(
            c => c.tdpSupport >= cpu.tdp && c.sockets.includes(cpu.socket)
        );
        if (suitableCoolers.length > 0) {
            suggestions.push({
                category: 'cooling',
                icon: '❄️',
                title: 'Tản nhiệt gợi ý',
                detail: `CPU ${cpu.name} có TDP ${cpu.tdp}W`,
                items: suitableCoolers.slice(0, 3),
            });
        }
    }

    // Suggest GPU based on CPU tier
    if (cpu && !vga) {
        const tierOrder = ['budget', 'mid', 'mid-high', 'high', 'ultra'];
        const cpuTierIdx = tierOrder.indexOf(cpu.tier);
        const balancedTiers = tierOrder.slice(Math.max(0, cpuTierIdx - 1), cpuTierIdx + 2);
        const balancedGPUs = allComponents.vga.filter(g => balancedTiers.includes(g.tier));
        if (balancedGPUs.length > 0) {
            suggestions.push({
                category: 'vga',
                icon: '🎮',
                title: 'VGA gợi ý',
                detail: `Cân bằng với CPU tier "${cpu.tier}"`,
                items: balancedGPUs.slice(0, 3),
            });
        }
    }

    return suggestions;
}

/**
 * Format price in VND
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}

/**
 * Calculate total build price
 */
export function calculateTotalPrice(selectedComponents) {
    return Object.values(selectedComponents)
        .filter(Boolean)
        .reduce((total, component) => total + (component.price || 0), 0);
}
